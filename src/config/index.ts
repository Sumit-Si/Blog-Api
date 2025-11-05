import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ["http://localhost:5173","http://localhost:5174"]
}

export default config;