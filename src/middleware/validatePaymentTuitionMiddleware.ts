import { Request, Response, NextFunction } from "express";

export const validatePaymentTuition = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    academicYear,
    studentName,
    matricule,
    studentClass,
    installment,
    paymentMethod,
  } = req.body;

  if (
    !academicYear ||
    !studentName ||
    !matricule ||
    !studentClass ||
    !installment ||
    !paymentMethod
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  next();
};
