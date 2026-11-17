import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl space-y-6 text-center">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">
            Quiz Builder
          </h1>

          <p className="mt-4 text-lg text-gray-500">
            Build custom quizzes, manage your questions,
            and organize everything in one place.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/create"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Quiz
          </Link>

          <Link
            href="/quizzes"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            View Quizzes
          </Link>
        </div>
      </div>
    </main>
  );
}
