import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController, loginUserController, refreshUserSessionController, logoutUserController, requestResetEmailController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema, requestResetEmailSchema } from "../validation/auth.js";
import { authenticate } from "../middlewares/authenticate.js";



const router = Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', authenticate, ctrlWrapper(refreshUserSessionController));
router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post('/request-reset', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));


export const authRouter = router;
