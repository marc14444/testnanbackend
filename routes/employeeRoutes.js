import express from "express";
import { getAllEmployees, createEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", getAllEmployees);
router.post("/", createEmployee);

export default router;