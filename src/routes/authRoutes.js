import express from "express";
import { AuthLogin, AuthRegister } from "../controller/authControl.js";

const router = express.Router();

router.post("/register", AuthRegister).post("/login", AuthLogin);

export default router;
