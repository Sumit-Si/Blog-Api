import { Router } from "express";
import register from "@/controllers/v1/auth/register";

const router = Router();

router
    .route("/register")
    .post(register);


export default router;