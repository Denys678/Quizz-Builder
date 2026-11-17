export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export type QuestionOptionInput = {
    text: string;
    isCorrect: boolean;
};

export type BooleanQuestionInput = {
    title: string;
    type: "BOOLEAN";
    correctBoolean: boolean;
};

export type InputQuestionInput = {
    title: string;
    type: "INPUT";
    correctText: string;
};

export type CheckboxQuestionInput = {
    title: string;
    type: "CHECKBOX";
    options: QuestionOptionInput[];
};

export type QuestionInput = BooleanQuestionInput | InputQuestionInput | CheckboxQuestionInput;

export type CreateQuizInput = {
    title: string;
    questions: QuestionInput[];
};

export type QuestionOption = {
    id: string;
    questionId: string;
    text: string;
    isCorrect: boolean;
    position: number;
};

export type Question = {
    id: string;
    quizId: string;
    title: string;
    type: QuestionType;
    position: number;
    correctBoolean: boolean | null;
    correctText: string | null;
    options: QuestionOption[];
};

export type Quiz = {
    id: string;
    title: string;
    createdAt: string;
    questions: Question[];
};

export type QuizSummary = {
    id: string;
    title: string;
    createdAt: string;
    questionsCount: number;
};