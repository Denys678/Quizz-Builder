import type { CreateQuizInput, Quiz, QuizSummary } from "@/types/quiz.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getAllQuizzes(signal?: AbortSignal): Promise<QuizSummary[]> {
    const response = await fetch(`${API_URL}/quizzes`, {
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed fetching quizzes");
    }

    return response.json();
}

export async function getQuizById(quizId: string, signal?: AbortSignal): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed to get quiz");
    }

    return response.json();
}

export async function createQuiz(data: CreateQuizInput): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create quiz");
    }

    return response.json();
}

export async function deleteQuiz(quizId: string): Promise<void> {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete quiz");
    }
}