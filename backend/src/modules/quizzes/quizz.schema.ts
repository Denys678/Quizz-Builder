import { z } from "zod";

const questionOptionSchema = z.strictObject({
    text: z.string().trim().min(1, "Option text is required"),
    isCorrect: z.boolean(),
});

const booleanQuestionSchema = z.strictObject({
    title: z.string().trim().min(1, "Question title is required"),
    type: z.literal("BOOLEAN"),
    correctBoolean: z.boolean(),
});

const inputQuestionSchema = z.strictObject({
    title: z.string().trim().min(1, "Question title is required"),
    type: z.literal("INPUT"),
    correctText: z.string().trim().min(1, "Correct answer is required"),
});

const checkboxQuestionSchema = z.strictObject({
    title: z.string().trim().min(1, "Question title is required"),
    type: z.literal("CHECKBOX"),
    options: z
        .array(questionOptionSchema)
        .min(2, "At least two options are required")
        .refine(
            (options) => options.some((option) => option.isCorrect),
            { message: "At least one option must be correct" },
        ),
});

const questionSchema = z.discriminatedUnion("type", [
    booleanQuestionSchema,
    inputQuestionSchema,
    checkboxQuestionSchema,
]);

export const createQuizSchema = z.strictObject({
    title: z.string().trim().min(1, "Quiz title is required"),
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;