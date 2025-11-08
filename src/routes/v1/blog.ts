import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";
import { authenticate } from "@/middlewares/authenticate";
import validationErrors from "@/middlewares/validationError";
import User from "@/models/user";
import { authorize } from "@/middlewares/authorize";
import createBlog from "@/controllers/v1/blog/create_blog";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

const upload = multer();
const router = Router();

router
    .route("/")
    .post(authenticate,
        authorize(["admin"]),
        upload.single("banner_image"),
        uploadBlogBanner("post"),
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({max: 180})
            .withMessage("Title must be less than 180 characters"),

        body("content")
            .trim()
            .notEmpty()
            .withMessage("Content is required"),

        body("status")
            .optional()
            .isIn(["draft", "published"])
            .withMessage("Status must be one of the value, draft or published"),
        
        validationErrors,
        createBlog
    )


export default router;