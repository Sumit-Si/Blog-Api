import { Router } from "express";

const router = Router();

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
    })

export default router;