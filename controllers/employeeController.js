import Employee from "../models/Employee.js";

// Récupérer tous les employés
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouvel employé
export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, position, phone, profileImage } = req.body;
    const newEmployee = new Employee({ firstName, lastName, email, position, phone, profileImage });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};