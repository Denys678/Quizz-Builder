"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/services/quiz.service";
import type { CreateQuizInput, QuestionInput } from "@/types/quiz.types";
import QuestionForm from "./QuestionForm";

type FormQuestion = {
    clientId: string;
    data: QuestionInput;
};

function validateQuiz(data: CreateQuizInput): string | null {
    if (!data.title.trim()) {
        return "Quiz title is required";
    }

    if (data.questions.length === 0) {
        return "Add at least one question";
    }

    for (const [index, question] of data.questions.entries()) {
        const number = index + 1;

        if (!question.title.trim()) {
            return `Question ${number}: title is required`;
        }

        if (question.type === "INPUT") {
            if (!question.correctText.trim()) {
                return `Question ${number}: correct answer is required`;
            }
        }

        if (question.type === "CHECKBOX") {
            if (question.options.length < 2) {
                return `Question ${number}: at least two options are required`;
            }

            if (question.options.some((option) => !option.text.trim())) {
                return `Question ${number}: all options must have text`;
            }

            if (!question.options.some((option) => option.isCorrect)) {
                return `Question ${number}: select at least one correct option`;
            }
        }
    }

    return null;
}

export default function QuizForm() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<FormQuestion[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function addQuestion() {
        const newQuestion: FormQuestion = {
            clientId: crypto.randomUUID(),
            data: {
                title: "",
                type: "BOOLEAN",
                correctBoolean: false,
            },
        };

        setQuestions((prev) => [...prev, newQuestion]);
    }

    function removeQuestion(clientId: string) {
        setQuestions((prev) =>
            prev.filter((question) => question.clientId !== clientId),
        );
    }

    function updateQuestion(clientId: string, data: QuestionInput) {
        setQuestions((prev) =>
            prev.map((question) =>
                question.clientId === clientId ? { ...question, data } : question
            ),
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) return;

        setError("");

        const payload: CreateQuizInput = {
            title: title.trim(),
            questions: questions.map((question) => question.data),
        };

        const validationError = validateQuiz(payload);

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        try {
            const createdQuiz = await createQuiz(payload);
            router.push(`/quizzes/${createdQuiz.id}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong while creating the quiz");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6"
        >
            <div>
                <h1 className="text-3xl font-bold">Create Quiz</h1>
                <p className="mt-2 text-gray-500">
                    Create a quiz with custom questions.
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="quiz-title" className="block font-medium">
                    Quiz title
                </label>

                <input
                    id="quiz-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter quiz title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>

            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div
                        key={question.clientId}
                        className="space-y-4 rounded-xl border border-gray-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Question {index + 1}
                            </h2>

                            <button
                                type="button"
                                onClick={() => removeQuestion(question.clientId)}
                                disabled={isSubmitting}
                                className="cursor-pointer text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                                Remove
                            </button>
                        </div>

                        <QuestionForm
                            clientId={question.clientId}
                            question={question.data}
                            onChange={(data) => updateQuestion(question.clientId, data)}
                        />
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addQuestion}
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 font-medium transition hover:border-gray-500 disabled:opacity-50"
            >
                Add Question
            </button>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Creating quiz..." : "Create Quiz"}
            </button>
        </form>
    );
}
