import { logger } from "@/lib/winston";
import Blog from "@/models/blog";
import Comment from "@/models/comment";
import type { Request, Response } from "express";

const getCommentsByBlog = async (req: Request,res: Response): Promise<void> => {
    const userId = req.userId;
    const blogId = req.params.blogId;
    try {
        const blog = await Blog.findById(blogId).select("_id commentsCount").lean().exec();

        if(!blog) {
            res.status(404).json({
                code: "NotFound",
                message: "Blog not found",
            });
            return;
        }

        const comments = await Comment.find({blogId})
            .sort({createdAt: -1})
            .lean()
            .exec();

        
        res.status(200).json({
            comment: comments,
        });
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error,
        });

        logger.error("Error while fetching comments",error);
    }
}

export default getCommentsByBlog;