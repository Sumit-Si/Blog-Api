import express from "express";
import config from "@/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import type { CorsOptions } from "cors";
import limiter from "@/lib/express_rate_limit";
import v1Router from "@/routes/v1";

const app = express();
const PORT = config.PORT || 3000;

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === "development" || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Reject requests from non-whitelisted origins
            callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
            console.log(`CORS error: ${origin} is not allowed by CORS`);

        }
    }
}

// middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
// Enable response compression to reduce payload size and improve performance
app.use(compression({
    threshold: 1024,    // Only compress responses larger than 1kb
}))
// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);


// routes
(async () => {
    try {
        app.use("/api/v1", v1Router);
    } catch (error) {
        console.log("Failed to start the server", error);

        if (config.NODE_ENV === "production") {
            process.exit(1);
        }
    }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 * 
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * -Exits the process with status code '0' (indicating a successful shutdown).
 */

const handleServerShutdown = async () => {
    try {
        console.log(`Server SHUTDOWN`);
        process.exit(0);
        
    } catch (error) {
        console.log(`Error during server shutdown`,error);
    }
}

/**
 * Listeners for termination signals (`SIGTERM` and `SIGINT`).
 * 
 * - `SIGTERM`: is typically sent when stopping a process (e.g., `Kill` command or container shutdown).
 * - `SIGINT`: is typically sent when the user interrupts the process (e.g. pressing `Ctrl+C`).
 * - When either signal is received, the `handleServerShutdown` function is executed to ensure proper cleanup.
 */

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

})