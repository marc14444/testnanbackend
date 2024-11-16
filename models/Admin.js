import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    numeroTelephone: { type: String, required: true ,unique: true},
    motDePasse: { type: String, required: true },
    role: { type: String, default: 'admin' },
    dateDeCreation: { type: Date, default: Date.now },
    dateDeModification: { type: Date, default: Date.now },
    etat: { type: Boolean, default: true },
    expires: {type: Date, default: Date.now },
    lastLogin: {type: Date, default: Date.now },
    lastLogout: {type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    lastActivity: {type: Date, default: Date.now },
    lastIp: {type: String, default: '127.0.0.1' },
    lastUserAgent: {type: String, default: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' },
    lastVisit: {type: Date, default: Date.now },
    lastUserAgent: String,
    lastVisit: Date,
    lastPage: {type: String, default: 'home' },
    lastError: {type: String, default: 'Aucune erreur' },
    lastErrorLocation: {type: String, default: 'Aucune erreur' },
    lastErrorStack: {type: String, default: 'Aucune erreur' },
    lastErrorDate: {type: Date, default: Date.now },
    lastErrorCount: {type: Number, default: 0 },
    lastErrorRate: {type: Number, default: 0 },
    lastErrorTime: {type: Date, default: Date.now },
});
  
const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
