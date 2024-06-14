import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController, loginUserController, refreshUserSessionController, logoutUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../validation/auth.js";
import { authenticate } from "../middlewares/authenticate.js";



const router = Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', authenticate, ctrlWrapper(refreshUserSessionController));
router.post('/logout', authenticate, ctrlWrapper(logoutUserController));


export const authRouter = router;
