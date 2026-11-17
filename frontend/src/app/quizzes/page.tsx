"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteQuiz, getAllQuizzes } from "@/services/quiz.service";
import type { QuizSummary } from "@/types/quiz.types";

import { Trash2 } from "lucide-react";

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        getAllQuizzes(controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) {
                    setQuizzes(data);
                }
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                setError(error instanceof Error ? error.message : "Failed to load quizzes");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    async function handleDelete(id: string) {
        if (deletingId !== null) return;

        const confirmed = window.confirm("Are you sure you want to delete this quiz?");

        if (!confirmed) return;

        setDeletingId(id);
        setError("");

        try {
            await deleteQuiz(id);

            setQuizzes((prev) =>
                prev.filter((quiz) => quiz.id !== id),
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to delete quiz");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Quizzes</h1>
                    <p className="mt-2 text-gray-500">
                        Browse and manage your quizzes.
                    </p>
                </div>

                <Link
                    href="/create"
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                    Create Quiz
                </Link>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                >
                    {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-gray-500">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No quizzes yet
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Create your first quiz to get started.
                    </p>

                    <Link
                        href="/create"
                        className="mt-5 inline-block font-medium text-blue-600 hover:underline"
                    >
                        Create a quiz
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {quizzes.map((quiz) => (
                        <article
                            key={quiz.id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-5 transition hover:border-gray-400"
                        >
                            <Link
                                href={`/quizzes/${quiz.id}`}
                                className="min-w-0 flex-1"
                            >
                                <h2 className="truncate text-lg font-semibold hover:text-blue-600">
                                    {quiz.title}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    {quiz.questionsCount}{" "}
                                    {quiz.questionsCount === 1 ? "question" : "questions"}
                                </p>
                            </Link>

                            <button
                                type="button"
                                onClick={() => handleDelete(quiz.id)}
                                disabled={deletingId !== null}
                                aria-label={`Delete ${quiz.title}`}
                                title="Delete quiz"
                                className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === quiz.id ? (
                                    <span>...</span>
                                ) : (
                                    <Trash2 size={20} aria-hidden="true" />
                                )}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
