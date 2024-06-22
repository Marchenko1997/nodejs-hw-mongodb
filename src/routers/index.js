// import {Router} from "express";
// import { authRouter } from "./auth.js";
// import { contactsRouter } from "./contacts.js";

// const router = Router();

// router.use('/contacts', contactsRouter);
// router.use('/auth', authRouter);

// export default router;

// src/routers/index.js
import { Router } from "express";
import { authRouter } from "./auth.js";
import { contactsRouter } from "./contacts.js";

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.status(200).json({ message: "Your service is live 🎉" });
});

export default router;
