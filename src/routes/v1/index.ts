import { Router } from "express";

const router = Router();

// routes
import authRoutes from "@/routes/v1/auth"
import userRoutes from "@/routes/v1/user";
import blogRoutes from "@/routes/v1/blog";

router
    .route("/")
    .get((req, res) => {
        res
            .status(200)
            .json({
                status: "ok",
                message: "API is live",
                version: "1.0.0",
                docs: "http://docs.blog-api.sumit.com",
                timestamp: new Date().toISOString(),
            })
    });

router
    .use("/auth",authRoutes);

router
    .use("/users", userRoutes);

router
    .use("/blogs", blogRoutes);

export default router;