import { Request, Response } from "express";
import { PaymentTuitionModel } from "../models/paymentTuitionModel.js";

export const submitPaymentTuition = async (req: Request, res: Response) => {
  try {
    const paymentData = new PaymentTuitionModel(req.body);
    await paymentData.save();
    res.status(201).json({
      message: "Payment tuition submitted successfully",
      data: paymentData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting payment tuition", error });
  }
};
