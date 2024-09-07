import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Student from "../models/studentSchema.js";
import { User } from "../models/baseUserModel.js";

// Define validation rules
export const validatePaymentTuition = [
  body("academicYear").notEmpty().withMessage("Academic year is required!"),
  body("studentName").notEmpty().withMessage("Student name is required!"),
  body("matricule").notEmpty().withMessage("Matricule is required!"),
  body("studentClass").notEmpty().withMessage("Student class is required!"),
  body("installment")
    .isNumeric()
    .withMessage("Installment must be a number!")
    .custom(async (installment, { req }) => {
      const { matricule } = req.body;
      const student = await User.findOne({matricule: matricule });
      
      let currentFees = student.currentFees || 0;
      if (!student) {
        throw new Error("Student not found with the provided matricule.");
      }
      if (currentFees + installment < 50000) {
        currentFees += installment;
        // Optionally update the student's record here if needed
        await User.updateOne({ matricule: matricule }, { currentFees: currentFees });
      } else throw new Error("You have completed the school fees.");
    }),
  body("paymentMethod").notEmpty().withMessage("Payment method is required!"),
  body("additionalNotes")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Additional notes must be a string."),
];

// Middleware to handle validation results
export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
