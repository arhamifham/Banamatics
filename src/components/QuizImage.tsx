interface Quiz {
  image: string;
  answer: number;
}

interface QuizImageProps {
  quiz: Quiz | null;
}

export function QuizImage({ quiz }: QuizImageProps) {
  if (!quiz) {
    return (
      <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-8 text-center">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 rounded-lg p-8 text-center">
      <p className="text-sm text-gray-600 mb-4">Solve for the banana! 🍌</p>
      <div className="text-5xl mb-4 min-h-[200px] flex items-center justify-center">
        <img
          src={quiz.image}
          alt="Banana Math Puzzle"
          className="rounded-lg border border-yellow-300 shadow-md max-h-[300px]"
        />
      </div>
      <p className="text-sm text-gray-500 mt-4">What number does 🍌 replaces?</p>
    </div>
  );
}
