"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuizById } from "@/services/quiz.service";
import type { Quiz } from "@/types/quiz.types";

export default function QuizDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        getQuizById(id, controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) {
                    setQuiz(data);
                }
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                setError(error instanceof Error ? error.message : "Failed to load quiz");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [id]);

    if (isLoading) {
        return (
            <main className="mx-auto max-w-3xl p-6">
                <p className="text-gray-500">Loading quiz...</p>
            </main>
        );
    }

    if (error || !quiz) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 p-6">
                <p role="alert" className="text-red-600">
                    {error || "Quiz not found"}
                </p>

                <Link
                    href="/quizzes"
                    className="text-blue-600 hover:underline"
                >
                    Back to quizzes
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6">
            <Link
                href="/quizzes"
                className="inline-block text-sm font-medium text-blue-600 hover:underline"
            >
                Back to quizzes
            </Link>

            <div>
                <h1 className="text-3xl font-bold">{quiz.title}</h1>

                <p className="mt-2 text-gray-500">
                    {quiz.questions.length}{" "}
                    {quiz.questions.length === 1 ? "question" : "questions"}
                </p>
            </div>

            <div className="space-y-5">
                {quiz.questions.map((question, index) => (
                    <article
                        key={question.id}
                        className="space-y-5 rounded-xl border border-gray-200 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold">
                                Question {index + 1}
                            </h2>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {question.type === "BOOLEAN" ? "True / False" : question.type === "INPUT" ? "Short Answer" : "Multiple Choice"}
                            </span>
                        </div>

                        <p className="text-gray-800">{question.title}</p>

                        {question.type === "BOOLEAN" && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="mb-2 text-sm font-medium text-gray-500">
                                    Correct answer
                                </p>

                                <p className="font-medium">
                                    {question.correctBoolean === true ? "True" : "False"}
                                </p>
                            </div>
                        )}

                        {question.type === "INPUT" && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="mb-2 text-sm font-medium text-gray-500">
                                    Correct answer
                                </p>

                                <p className="font-medium">
                                    {question.correctText}
                                </p>
                            </div>
                        )}

                        {question.type === "CHECKBOX" && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-500">
                                    Answer options
                                </p>

                                {question.options.map((option) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={option.isCorrect}
                                            disabled
                                            readOnly
                                            className="h-4 w-4"
                                        />

                                        <span className="flex-1">
                                            {option.text}
                                        </span>

                                        {option.isCorrect && (
                                            <span className="text-xs font-medium text-green-700">
                                                Correct
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </main>
    );
}
