import { prisma } from "../../lib/prisma.ts";
import { AppError } from "../../utils/AppError.ts";
import type { CreateQuizInput } from "./quizz.schema.ts";

const quizInclude = {
    questions: {
        orderBy: { position: "asc" as const },
        include: {
            options: {
                orderBy: { position: "asc" as const },
            },
        },
    },
};

export async function createQuiz(data: CreateQuizInput) {
    return prisma.quiz.create({
        data: {
            title: data.title,
            questions: {
                create: data.questions.map((question, index) => {
                    switch (question.type) {
                        case "BOOLEAN":
                            return {
                                title: question.title,
                                type: question.type,
                                position: index,
                                correctBoolean: question.correctBoolean,
                            };

                        case "INPUT":
                            return {
                                title: question.title,
                                type: question.type,
                                position: index,
                                correctText: question.correctText,
                            };

                        case "CHECKBOX":
                            return {
                                title: question.title,
                                type: question.type,
                                position: index,
                                options: {
                                    create: question.options.map((option, optionIndex) => ({
                                        text: option.text,
                                        isCorrect: option.isCorrect,
                                        position: optionIndex,
                                    })),
                                },
                            };
                    }
                }),
            },
        },
        include: quizInclude,
    });
}

export async function getAllQuizzes() {
    const quizzes = await prisma.quiz.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
                select: {
                    questions: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return quizzes.map(({ _count, ...quiz }) => ({
        ...quiz,
        questionsCount: _count.questions,
    }));
}

export async function getQuizById(id: string) {
    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: quizInclude,
    });

    if (!quiz) {
        throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
    }

    return quiz;
}

export async function deleteQuiz(id: string) {
    const result = await prisma.quiz.deleteMany({
        where: { id },
    });

    if (result.count === 0) {
        throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
    }
}
