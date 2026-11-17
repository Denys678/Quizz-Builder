import type { QuestionInput, QuestionType } from "@/types/quiz.types";
import CheckboxOptions from "./CheckboxOptions";

type QuestionFormProps = {
    clientId: string;
    question: QuestionInput;
    onChange: (question: QuestionInput) => void;
};

export default function QuestionForm({ clientId, question, onChange }: QuestionFormProps) {
    function handleTypeChange(type: QuestionType) {
        switch (type) {
            case "BOOLEAN":
                onChange({
                    title: question.title,
                    type: "BOOLEAN",
                    correctBoolean: false,
                });
                break;

            case "INPUT":
                onChange({
                    title: question.title,
                    type: "INPUT",
                    correctText: "",
                });
                break;

            case "CHECKBOX":
                onChange({
                    title: question.title,
                    type: "CHECKBOX",
                    options: [
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                    ],
                });
                break;
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label
                    htmlFor={`question-${clientId}`}
                    className="block text-sm font-medium"
                >
                    Question
                </label>

                <input
                    id={`question-${clientId}`}
                    type="text"
                    value={question.title}
                    onChange={(event) => onChange({ ...question, title: event.target.value })}
                    placeholder="Enter your question"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor={`type-${clientId}`}
                    className="block text-sm font-medium"
                >
                    Question type
                </label>

                <select
                    id={`type-${clientId}`}
                    value={question.type}
                    onChange={(event) => handleTypeChange(event.target.value as QuestionType)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
                >
                    <option value="BOOLEAN">True / False</option>
                    <option value="INPUT">Short Answer</option>
                    <option value="CHECKBOX">Multiple Choice</option>
                </select>
            </div>

            {question.type === "BOOLEAN" && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Correct answer</p>

                    <div className="flex gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name={`boolean-${clientId}`}
                                checked={question.correctBoolean === true}
                                onChange={() =>
                                    onChange({ ...question, correctBoolean: true })
                                }
                            />
                            True
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name={`boolean-${clientId}`}
                                checked={question.correctBoolean === false}
                                onChange={() =>
                                    onChange({ ...question, correctBoolean: false })
                                }
                            />
                            False
                        </label>
                    </div>
                </div>
            )}

            {question.type === "INPUT" && (
                <div className="space-y-2">
                    <label
                        htmlFor={`answer-${clientId}`}
                        className="block text-sm font-medium"
                    >
                        Correct answer
                    </label>

                    <input
                        id={`answer-${clientId}`}
                        type="text"
                        value={question.correctText}
                        onChange={(event) =>
                            onChange({ ...question, correctText: event.target.value })
                        }
                        placeholder="Enter the correct answer"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    />
                </div>
            )}

            {question.type === "CHECKBOX" && (
                <CheckboxOptions
                    options={question.options}
                    onChange={(options) => onChange({ ...question, options })}
                />
            )}
        </div>
    );
}
