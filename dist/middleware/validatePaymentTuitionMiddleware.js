export const validatePaymentTuition = (req, res, next) => {
    const { academicYear, studentName, matricule, studentClass, installment, paymentMethod, } = req.body;
    if (!academicYear ||
        !studentName ||
        !matricule ||
        !studentClass ||
        !installment ||
        !paymentMethod) {
        return res.status(400).json({ message: "All fields are required." });
    }
    next();
};
//# sourceMappingURL=validatePaymentTuitionMiddleware.js.map