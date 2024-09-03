import { Router } from "express";
import { submitPaymentTuition } from "../controllers/paymentTuitionController.js";
import { validatePaymentTuition } from "../middleware/validatePaymentTuitionMiddleware.js";
const router = Router();
router.post("/payment-tuition", validatePaymentTuition, submitPaymentTuition);
export default router;
//# sourceMappingURL=paymentTuitionRoutes.js.map