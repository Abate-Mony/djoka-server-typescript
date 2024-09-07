import { PaymentTuitionModel } from "../models/paymentTuitionModel.js";
import { User } from "../models/baseUserModel.js";
export const submitPaymentTuition = async (req, res) => {
    // console.log("Request Body:", req.body); // Log the incoming request body
    try {
        const { matricule, installment } = req.body;
        // Update the student's current fees
        await User.updateOne({ matricule }, { $inc: { currentFees: installment } });
        // Create a new payment record
        const paymentData = new PaymentTuitionModel(req.body);
        const newPayment = await paymentData.save();
        res.status(201).json({
            message: "Payment tuition submitted successfully",
            data: newPayment,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error submitting payment tuition", error });
    }
};
//# sourceMappingURL=paymentTuitionController.js.map