import { Router } from "express";
import {param} from "express-validator";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";
import likeBlog from "@/controllers/v1/like/like_blog";
import validationErrors from "@/middlewares/validationError";
import unlikeBlog from "@/controllers/v1/like/unlike_blog";

const router = Router();

router
    .route("/blog/:blogId")
    .post(authenticate,
        authorize(["admin","user"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        likeBlog
    );

router
    .route("/blog/:blogId")
    .delete(authenticate,
        authorize(["admin","user"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        validationErrors,
        unlikeBlog
    );

export default router;