import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

const validationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json({
            code: "ValidationError",
            errors: errors.mapped(),
        });

        return;
    }
}

export default validationErrors;