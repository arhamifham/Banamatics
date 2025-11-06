interface Quiz {
  formula: string;
  answer: number;
}

interface QuizImageProps {
  quiz: Quiz;
}

export function QuizImage({ quiz }: QuizImageProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-lg p-8 text-center">
      <p className="text-sm text-gray-600 mb-4">Solve for the banana! 🍌</p>
      <div className="text-5xl mb-4 space-y-2 min-h-[200px] flex items-center justify-center">
        <pre className="font-mono whitespace-pre-wrap">{quiz.formula}</pre>
      </div>
      <p className="text-sm text-gray-500 mt-4">What number does 🍌 represent?</p>
    </div>
  );
}
