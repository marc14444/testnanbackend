import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from './routes/adminRoutes.js';



import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.disable('x-powered-by');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000 ;

// Routes de l'admin
app.use("/api/admin", adminRoutes);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "/uploads"))
  );
app.listen(port,'0.0.0.0', () => console.log(`Écoute sur le port ${port}`));