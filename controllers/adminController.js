import Employee from "../models/Employee.js";
import Admin from '../models/Admin.js';
import path from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import validator from 'validator';
import nodemailer from 'nodemailer';

dotenv.config();

const MAX_ADMINS = 2;
const SALT_ROUNDS = 10; // Nombre de rounds pour le salage du mot de passe

// Enregistrer un administrateur
export const registerAdmin = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount >= MAX_ADMINS) {
            return res.status(403).json({ message: "Le nombre maximum d'administrateurs est atteint." });
        }

        const { motDePasse, nom, prenom, email, numeroTelephone } = req.body;

        // Validation des champs requis
        if (!motDePasse || !nom || !prenom || !email || !numeroTelephone) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Validation des formats d'email et de téléphone
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "L'email n'est pas valide." });
        }

        /* if (!validator.isMobilePhone(numeroTelephone, 'fr-FR', { strictMode: true })) {
            return res.status(400).json({ message: "Le numéro de téléphone n'est pas valide." });
        } */

        // Vérification si l'email existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Un administrateur avec cet email existe déjà." });
        }

        // Vérification si le numéro de téléphone existe déjà
        const existingAdminNumber = await Admin.findOne({ numeroTelephone });
        if (existingAdminNumber) {
            return res.status(400).json({ message: "Un administrateur avec ce numéro de téléphone existe déjà." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);

        // Création de l'administrateur
        const newAdmin = new Admin({ nom, prenom, email, numeroTelephone, motDePasse: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Administrateur enregistré avec succès.", data: newAdmin });
        console.log('Admin enregistré:', newAdmin);
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'administrateur.", error });
    }
};

// Connexion d'un administrateur (login)
export const loginAdmin = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier si l'email est fourni
        if (!email || !motDePasse) {
            return res.status(400).json({ message: 'Email et mot de passe sont requis' });
        }

        // Vérifier si l'email existe dans la base de données
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier si le mot de passe est correct
        const isPasswordValid = await bcrypt.compare(motDePasse, admin.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer le token JWT avec la clé secrète depuis les variables d'environnement
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.ADMIN_TOKEN_SECRET,  // Clé secrète depuis le fichier .env
            { expiresIn: '24h' }
        );

        // Exclure le mot de passe des données retournées
        const { motDePasse: _, ...adminData } = admin.toObject();

        // Renvoi de la réponse avec le token et les données de l'administrateur
        res.status(200).json({
            message: 'Connexion réussie',
            token: token,
            adminId: admin._id,
            data: adminData
        });
    } catch (error) {
        // Afficher l'erreur dans la console pour le débogage
        console.error(error);

        // Retourner une réponse d'erreur plus détaillée
        res.status(500).json({
            message: 'Une erreur est survenue lors de la connexion',
            error: error.message || error
        });
    }
};

// Mise à jour d'un administrateur
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { motDePasse, nom, prenom, email, numeroTelephone } = req.body;

        // Trouver l'administrateur à mettre à jour
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Administrateur non trouvé." });
        }

        // Mettre à jour les informations de l'administrateur
        const updateData = { nom, prenom, email, numeroTelephone };
        if (motDePasse) {
            updateData.motDePasse = await bcrypt.hash(motDePasse, SALT_ROUNDS);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: "Administrateur mis à jour avec succès.", data: updatedAdmin });
        console.log('Admin mis à jour:', updatedAdmin);
        
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'administrateur.", error });
    }
};

// Créer un transporteur pour l'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Fonction pour envoyer l'email
export const sendWelcomeEmail = async (email, nom) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Bienvenue chez MarcServices!`,
      html: `
          <div style="font-family: 'Arial', sans-serif; text-align: center; padding: 20px;">
          <h1 style="color: #E91E63;">Bienvenue ${nom} !</h1>
          <p style="font-size: 18px; color: #333;">
              Votre compte chez <strong>MarcServices</strong> a été créé avec succès.
          </p>
          <img src="https://cdn.dribbble.com/userupload/17591835/file/original-1b95bc3c43b8cd74213133f8811790cf.png?resize=752x" alt="Welcome Image" style="width: 300px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 16px; color: #666;">
              Nous sommes ravis de vous accueillir au sein de la famille <strong>MarcServices</strong>, le leader du consulting technologique. <br>
              Vous faites désormais partie d'une équipe qui révolutionne l'industrie à travers l'innovation et l'excellence technologique. <br>
              Chez <strong>MarcServices</strong>, nous vous offrons des solutions de pointe pour optimiser vos projets et améliorer vos processus. Vous aurez accès à des outils, des ressources et une expertise pour accompagner votre réussite dans le secteur technologique. <br>
              Ensemble, nous créons des solutions intelligentes et durables pour répondre aux défis de demain.
          </p>
          <a href="https://www.marcservices.com" style="display: inline-block; padding: 10px 20px; background-color: #E91E63; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
              Explorer MarcServices
          </a>
      </div>
      `
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error('Une erreur est survenue lors de l\'envoi de l\'email');
  }
};


// Créer un employé
export const creerEmploye = async (req, res) => {
  try {
    const employe = new Employee(req.body);
    console.log(req.body);
    await employe.save();
     // Envoi de l'email de bienvenue après la création de l'employé
     await sendWelcomeEmail(employe.email, employe.nom);
    res.status(201).json({
      message: "Employé créé avec succès.",
      data: employe,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Modifier un employé
export const modifierEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const employe = await Employee.findByIdAndUpdate(id, req.body, {
      new: true, // Renvoie l'employé mis à jour
      runValidators: true, // Vérifie les validations du modèle
    });
    if (!employe) {
      return res.status(404).json({ message: "Employé introuvable." });
    }
    res.status(200).json({
      message: "Employé mis à jour avec succès.",
      data: employe,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un employé
export const supprimerEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const employe = await Employee.findByIdAndDelete(id);
    if (!employe) {
      return res.status(404).json({ message: "Employé introuvable." });
    }
    res.status(200).json({ message: "Employé supprimé avec succès." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Lister tous les employés
export const listerEmployes = async (req, res) => {
  try {
    const employes = await Employee.find({});
    res.status(200).json({
      message: "Liste des employés récupérée avec succès.",
      data: employes,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// recupere les statistiques sur les employés
export const getEmployeeStats = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.status(200).json({
      message: "Statistiques récupérées avec succès.",
      data: { count },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};