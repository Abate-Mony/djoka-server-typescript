import mongoose from "mongoose";
const paymentTuitionSchema = new mongoose.Schema({
    academicYear: { type: String, required: true },
    studentName: { type: String, required: true },
    matricule: { type: String, required: true },
    studentClass: { type: String, required: true },
    installment: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    additionalNotes: { type: String, optional: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const PaymentTuitionModel = mongoose.model("PaymentTuition", paymentTuitionSchema);
//# sourceMappingURL=paymentTuitionModel.js.map