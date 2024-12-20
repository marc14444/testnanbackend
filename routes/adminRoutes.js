import express from "express";
import {
    registerAdmin,
    loginAdmin,
    updateAdmin,
  listerEmployes,
  modifierEmploye,
  supprimerEmploye,
  creerEmploye,
  getEmployeeStats,
  getEmployeeById,
} from "../controllers/adminController.js"; // Contrôleurs de l'admin
import authAdmin from "../middleware/authAdmin.js"; // Middleware d'authentification
import upload from '../middleware/multerConfig.js'; // Module 

const router = express.Router();

// Protection des routes par authenticate et authorizeAdmin
//router.use(authAdmin);

// Routes pour inscription, connexion et mise à jour d'administrateur
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/update/:id', authAdmin, updateAdmin);

// Créer un nouvel employé
router.post("/employes", authAdmin, upload.single('photoProfil'), creerEmploye);

// Liste des employés
router.get("/employes",authAdmin, listerEmployes);

// Statistiques sur les employés (par exemple, nombre total d'employés)
router.get("/employes/stats", authAdmin, getEmployeeStats);
export default router;

// Récupérer un employé par son id
router.get("/employes/:id",authAdmin, getEmployeeById);

// Modifier un employé
router.put("/employes/:id",upload.single('photoProfil'),authAdmin, modifierEmploye);

// Supprimer un employé
router.delete("/employes/:id",authAdmin, supprimerEmploye);
