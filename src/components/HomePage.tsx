import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QuizImage } from './QuizImage';
import { generateQuiz } from './utils/quizGenerator';

export function HomePage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      const newQuiz = await generateQuiz();
      setQuiz(newQuiz);
    }
    fetchQuiz();
  }, []);
  

  async function loadQuiz() {
    const newQuiz = await generateQuiz();
    setQuiz(newQuiz);
  }

  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (!answer) {
      toast.error('Please enter an answer');
      return;
    }

    if (parseInt(answer) === quiz.answer) {
      toast.success(`Correct answer! 🎉 ${attempts-1} attempts left`);
      setScore(score + 10);
      loadQuiz();
      setAnswer('');
      setAttempts(attempts - 1);
    } else {
      setAttempts(attempts - 1);
      toast.error(`Wrong answer! ${attempts - 1} attempts left`);
      setAnswer('');
    }
      if (attempts - 1 === 0) {
        toast.error('Trial ended! Please login to continue playing.');
        setTimeout(() => navigate('/login'), 2000);
      }
    
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-yellow-100 to-orange-50">
      <div className="text-center mb-8">
        <h1 className="text-6xl mb-4">🍌 BANAMATIX 🍌</h1>
        <p className="text-xl text-gray-700">Solve the banana math puzzles!</p>
      </div>

      <Card className="mb-6 bg-white/90 backdrop-blur">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Trial Mode</CardTitle>
            <Badge variant="destructive">FREE TRIAL</Badge>
          </div>
          <CardDescription>Only 3 trial attempts available. Login for unlimited play!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 justify-center">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-8 h-8 ${i < attempts ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">Score: {score}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-white/90 backdrop-blur">
        <CardContent className="pt-6">
          <QuizImage quiz={quiz} />

          <div className="mt-6 space-y-4">
            <div>
              <label className="block mb-2">Your Answer:</label>
              <Input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter the missing number..."
                className="text-center text-2xl"
                disabled={attempts === 0}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              size="lg"
              disabled={attempts === 0}
            >
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button
          onClick={() => navigate('/login')}
          variant="outline"
          size="lg"
          className="w-full max-w-md"
        >
          Login / Register for Full Game
        </Button>
      </div>
    </div>
  );
}

