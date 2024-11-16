import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: String,
      required: true,
      enum: ["Manager", "Chef de Projet", "Développeur", "Chef de Service"],
      default: "Chef de Projet",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer une adresse email valide",
      ],
    },
    numeroTelephone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    dateEmbauche: {
      type: Date,
      default: Date.now,
    },
    pays: { type: String, required: true },
    ville: { type: String, required: true },
    commune: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;