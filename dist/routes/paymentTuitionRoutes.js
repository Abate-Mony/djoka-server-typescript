import express from "express";
import { submitPaymentTuition } from "../controllers/paymentTuitionController.js";
import { validatePaymentTuition, handleValidation, } from "../middleware/validatePaymentTuitionMiddleware.js";
const router = express.Router();
router.post("/", validatePaymentTuition, handleValidation, submitPaymentTuition);
export default router;
//# sourceMappingURL=paymentTuitionRoutes.js.map