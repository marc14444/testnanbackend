import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

export default (req, res, next) => {
  try {
    // Vérification de l'existence de l'en-tête Authorization
    const authHeader = req.headers.authorization;
    console.log("Authorization header : ", authHeader);
    if (!authHeader) {
      return res.status(401).json({
        error: "No authorization token provided",
        message: "Vous devez fournir un token d'autorisation",
        status: false,
      });
    }

    // Vérification du format du token (Bearer <token>)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid authorization format",
        message: "Le format du token est incorrect. Utilisez 'Bearer <token>'",
        status: false,
      });
    }

    // Vérification du token avec la clé secrète spécifique pour les administrateurs
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET); // Clé secrète depuis les variables d'environnement
    const adminId = decoded.adminId;

    // Vérification de la présence de adminId dans le token décodé
    if (!adminId) {
      return res.status(401).json({
        error: "Invalid Admin ID",
        message: "Authentification échouée, Vous n'êtes pas autorisé",
        status: false,
      });
    }

    // Ajout de l'adminId dans l'objet req.auth pour une utilisation ultérieure dans les autres middlewares/routes
    req.auth = { adminId };

    // Passage au middleware suivant
    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message || "Une erreur est survenue",
      message: "Authentification échouée. Veuillez vous reconnecter.",
      status: false,
    });
  }
};