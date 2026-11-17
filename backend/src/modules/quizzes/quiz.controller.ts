import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError.ts";
import { createQuizSchema } from "./quizz.schema.ts";
import * as quizService from "./quiz.service.ts";

export async function createQuiz(req: Request, res: Response): Promise<void> {
    const result = createQuizSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Invalid quiz data",
            errors: result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    const quiz = await quizService.createQuiz(result.data);

    res.status(201).json(quiz);
}

export async function getAllQuizzes(_req: Request, res: Response): Promise<void> {
    const quizzes = await quizService.getAllQuizzes();

    res.status(200).json(quizzes);
}


export async function getQuizById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== "string") {
        throw new AppError("Invalid quiz ID", 400, "INVALID_QUIZ_ID");
    }

    const quiz = await quizService.getQuizById(id);

    res.status(200).json(quiz);
}


export async function deleteQuiz(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (typeof id !== "string") {
        throw new AppError("Invalid quiz ID", 400, "INVALID_QUIZ_ID");
    }

    await quizService.deleteQuiz(id);

    res.status(204).send();
}
