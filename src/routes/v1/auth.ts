import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcryptjs";
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import validationErrors from "@/middlewares/validationError";
import User from "@/models/user";
import refreshToken from "@/controllers/v1/auth/refresh_token";
import logout from "@/controllers/v1/auth/logout";
import { authenticate } from "@/middlewares/authenticate";

const router = Router();

router
    .route("/register")
    .post(body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isLength({ max: 50 })
        .withMessage("Email must be less than 50 characters")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error("User email or password is invalid")
            }
        }),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),

        body("role")
            .optional()
            .isString()
            .withMessage("Role must be a string")
            .isIn(["admin", "user"])
            .withMessage("Role must be either admin or user"),
        validationErrors,
        register);

router
    .route("/login")
    .post(body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isLength({ max: 50 })
        .withMessage("Email must be less than 50 characters")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error("User email or password is invalid")
            }
        }),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .custom(async (value, { req }) => {
                const { email } = req.body as { email: string };
                const user = await User.findOne({ email })
                    .select("password")
                    .lean()
                    .exec();

                if (!user) {
                    throw new Error("User email or password is invalid");
                }

                const passwordMatch = await bcrypt.compare(value, user.password);

                if (!passwordMatch) {
                    throw new Error("User email or password is invalid");
                }
            }),
        validationErrors,
        login);

router
    .route("/refresh-token")
    .post(cookie("refreshToken")
        .notEmpty()
        .withMessage("Refresh token required")
        .isJWT()
        .withMessage("Invalid refresh token"),
        validationErrors,
        refreshToken);

router
    .route("/logout")
    .post(authenticate,logout)


export default router;