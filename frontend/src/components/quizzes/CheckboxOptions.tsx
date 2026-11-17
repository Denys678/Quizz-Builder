import { useState } from "react";
import type { QuestionOptionInput } from "@/types/quiz.types";

type CheckboxOptionsProps = {
    options: QuestionOptionInput[];
    onChange: (options: QuestionOptionInput[]) => void;
};

export default function CheckboxOptions({ options, onChange }: CheckboxOptionsProps) {
    const [optionIds, setOptionIds] = useState<string[]>(() =>
        options.map(() => crypto.randomUUID()),
    );

    function updateOption(index: number, changes: Partial<QuestionOptionInput>) {
        onChange(
            options.map((option, i) =>
                i === index ? { ...option, ...changes } : option,
            ),
        );
    }

    function addOption() {
        setOptionIds((prev) => [...prev, crypto.randomUUID()]);

        onChange([
            ...options,
            {
                text: "",
                isCorrect: false,
            },
        ]);
    }

    function removeOption(index: number) {
        if (options.length <= 2) return;

        setOptionIds((prev) => prev.filter((_, i) => i !== index));

        onChange(options.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            <div>
                <p className="text-sm font-medium">Answer options</p>
                <p className="text-xs text-gray-500">
                    Select all correct answers.
                </p>
            </div>

            {options.map((option, index) => (
                <div
                    key={optionIds[index]}
                    className="flex items-center gap-3"
                >
                    <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(event) => updateOption(index, { isCorrect: event.target.checked })}
                        aria-label={`Mark option ${index + 1} as correct`}
                        className="h-4 w-4 cursor-pointer"
                    />

                    <input
                        type="text"
                        value={option.text}
                        onChange={(event) => updateOption(index, { text: event.target.value })}
                        placeholder={`Option ${index + 1}`}
                        aria-label={`Option ${index + 1} text`}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <button
                        type="button"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                        className="cursor-pointer text-sm text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addOption}
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                Add Option
            </button>
        </div>
    );
}
