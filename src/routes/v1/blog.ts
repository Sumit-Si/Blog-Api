import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";
import { authenticate } from "@/middlewares/authenticate";
import validationErrors from "@/middlewares/validationError";
import User from "@/models/user";
import { authorize } from "@/middlewares/authorize";
import createBlog from "@/controllers/v1/blog/create_blog";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";
import getAllBlogs from "@/controllers/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controllers/v1/blog/get_blogs_by_user";
import getBlogBySlug from "@/controllers/v1/blog/get_blog_by_slug";
import updateBlog from "@/controllers/v1/blog/update_blog";
import deleteBlog from "@/controllers/v1/blog/delete_blog";

const upload = multer();
const router = Router();

router
    .route("/")
    .post(authenticate,
        authorize(["admin"]),
        upload.single("banner_image"),
        body("banner_image")
            .notEmpty()
            .withMessage("Banner image is required"),
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
        uploadBlogBanner("post"),
        createBlog
    );

router
    .route("/")
    .get(authenticate,
        authorize(["admin","user"]),
        query("limit")
            .optional()
            .isInt({min: 1,max: 50})
            .withMessage("Limit must be between 1 to 50"),

        query("offset")
            .optional()
            .isInt({min: 0})
            .withMessage("Offset must be a positive integer"),
        validationErrors,
        getAllBlogs
    );

router
    .route("/user/:userId")
    .get(authenticate,
        authorize(["admin","user"]),
        param("userId")
            .isMongoId()
            .withMessage("Invalid user Id"),
        query("limit")
            .optional()
            .isInt({min: 1,max: 50})
            .withMessage("Limit must be between 1 to 50"),

        query("offset")
            .optional()
            .isInt({min: 0})
            .withMessage("Offset must be a positive integer"),
        validationErrors,
        getBlogsByUser
    );

router
    .route("/:slug")
    .get(authenticate,
        authorize(["admin","user"]),
        param("slug")
            .notEmpty()
            .withMessage("Slug is required"),
            validationErrors,
            getBlogBySlug
    );

router
    .route("/:blogId")
    .put(authenticate,
        authorize(["admin"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        upload.single("banner_image"),

        body("title")
            .optional()
            .trim()
            .isLength({max: 180})
            .withMessage("Title must be less than 180 characters"),

        body("content")
            .optional()
            .trim()
            .isLength({max: 5000})
            .withMessage("Content must be less than 5000 characters"),
        
        body("status")
            .optional()
            .isIn(["draft", "published"])
            .withMessage("Status must be one of the value, draft or published"),
        
        validationErrors,
        uploadBlogBanner("put"),
        updateBlog
    );

router
    .route("/:blogId")
    .delete(authenticate,
        authorize(["admin"]),
        param("blogId")
            .isMongoId()
            .withMessage("Invalid blog Id"),
        validationErrors,
        deleteBlog
    )


export default router;