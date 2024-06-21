import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController, loginUserController, refreshUserSessionController, logoutUserController, requestResetEmailController, resetPasswordController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
import { authenticate } from "../middlewares/authenticate.js";



const router = Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', authenticate, ctrlWrapper(refreshUserSessionController));
router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));


export const authRouter = router;
