import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ["http://localhost:5173","http://localhost:5174"],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
}

export default config;