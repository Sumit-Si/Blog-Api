import * as express from "express";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            userId?: Types.ObjectId;    // this will fix the authentication file error on userId
        }
    }
}