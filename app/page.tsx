import QuizContainer from "@/components/quiz/QuizContainer";
export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-6">
        <QuizContainer />
      </div>
    </main>
  );
}