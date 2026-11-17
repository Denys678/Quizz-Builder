import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.ts";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
        return;
    }

    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({
            message: "Invalid JSON body",
        });
        return;
    }

    console.error("Unexpected error:", error);

    res.status(500).json({
        message: "Internal server error",
    });
};
