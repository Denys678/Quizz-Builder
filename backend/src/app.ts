import express from "express";
import quizRouter from "./modules/quizzes/quiz.routes.ts"
import { errorHandler } from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
    return res.status(200).json({
        status: "ok",
    });
});

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use("/quizzes", quizRouter);

app.use((_req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.use(errorHandler);

export default app;