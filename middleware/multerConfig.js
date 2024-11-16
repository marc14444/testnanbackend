import multer from 'multer';
import path from 'path';

// Configuration de multer pour stocker les fichiers dans un dossier spécifique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nom unique pour éviter les conflits
  },
});

// Filtrer les fichiers pour s'assurer que ce sont des images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Si c'est une image autorisée, on l'accepte
  } else {
    cb(new Error('Seules les images (jpeg, png, jpg) sont autorisées'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier : 5 Mo
});

// Utiliser ce middleware dans votre route pour gérer l'upload d'image
export default upload;