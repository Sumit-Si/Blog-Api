import { Router } from "express";
import {body, param} from "express-validator";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";
import validationErrors from "@/middlewares/validationError";
import commentBlog from "@/controllers/v1/comment/comment_blog";
import getCommentsByBlog from "@/controllers/v1/comment/get_comments_by_blog";
import deleteComment from "@/controllers/v1/comment/delete_comment";

const router = Router();

router
    .route("/blog/:blogId")
    .post(authenticate,
        authorize(["admin","user"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        body("content")
            .notEmpty()
            .withMessage("Content is required"),
        validationErrors,
        commentBlog
    );

router
    .route("/blog/:blogId")
    .get(authenticate,
        authorize(["admin","user"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        validationErrors,
        getCommentsByBlog
    );

router
    .route("/:commentId")
    .delete(authenticate,
        authorize(["admin"]),
        param("commentId")
            .isMongoId()
            .withMessage("Invalid comment Id"),
        validationErrors,
        deleteComment
    );

export default router;