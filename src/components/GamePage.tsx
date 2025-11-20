import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from './ui/card';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Badge } from './ui/badge';
import { Heart, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QuizImage } from './QuizImage';
import { generateQuiz } from './utils/quizGenerator';

interface Quiz {
  image: string;
  answer: number;
}

export function GamePage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answer, setAnswer] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate();

  const storeRedirect = () => {
    const user = JSON.parse(localStorage.getItem('banamatix_current_user') || '{}');

    if (!user.username) {
      navigate('/login');
    } else {
      navigate('/store');
    }
  };

  useEffect(() => {
    if (score > 0 && score % 30 === 0) {
      const user = JSON.parse(localStorage.getItem('banamatix_current_user') || '{}');

      const newCoins = (user.coins || 0) + 1;

      setCoins(newCoins);

      const updatedUser = { ...user, coins: newCoins };
      localStorage.setItem('banamatix_current_user', JSON.stringify(updatedUser));


      fetch('http://localhost:8001/banamatix_backend/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(() => {
      });

      toast.success('🍌 You earned 1 Banana Coin!');
    }
  }, [score]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('banamatix_current_user') || '{}');
    if (user.username) {
      setCurrentUser(user.username);
      setCoins(user.coins || 0);
    }

    async function fetchQuiz() {
      try {
        const newQuiz = await generateQuiz();
        setQuiz(newQuiz);
      } catch (err) {
        console.error('generateQuiz failed', err);
        setQuiz({ image: '🍌 + 2 = 5', answer: 3 });
      }
    }
    fetchQuiz();
  }, []);

  async function loadQuiz() {
    try {
      const newQuiz = await generateQuiz();
      setQuiz(newQuiz);
    } catch (err) {
      console.error('generateQuiz failed', err);
      setQuiz({ image: '🍌 + 2 = 5', answer: 3 });
    }
  }

  const handleSubmit = () => {
    if (!answer) {
      toast.error('Please enter an answer');
      return;
    }

    if (parseInt(answer) === quiz?.answer) {
      toast.success('Correct! 🎉');
      setScore((p) => p + 10);
      setAttempts(3);
      setAnswer('');
      loadQuiz();
    } else {
      const remaining = attempts - 1;
      setAttempts(remaining);
      toast.error(`Wrong answer! ${remaining} attempts left`);
      setAnswer('');

      if (remaining === 0) {
        toast.error('No attempts left! Game over.');
        setGameOver(true);
      }
    }
  };

  const restartGame = () => {
    setAttempts(3);
    setScore(0);
    setAnswer('');
    setGameOver(false);
    loadQuiz();
  };

  const logout = () => {
    localStorage.removeItem('banamatix_current_user');
    navigate('/login');
  };

      
  
  return (
    <>

    <Dialog open={gameOver} onClose={() => {}} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999}}>
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-md" />

      <div className="fixed inset-0 z-[10000] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel style={{width: '100%',maxWidth: '448px',padding: '2rem',   textAlign: 'center',display: 'block',margin: '0 auto',
          borderRadius: '1rem', backgroundColor: 'white',boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          position: 'relative',transform: 'translateY(0)',overflow: 'hidden',}}>
            <DialogTitle className="text-4xl font-bold text-red-600">
              You Lost!
            </DialogTitle>

            <p className="text-lg">
              Correct answer was: <strong>{quiz?.answer}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.location.reload()} 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 border"
              >
                <RotateCcw />
              </Button>
              <Button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-black px-4 py-2 border"
              >
                Logout
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
      <div className={`container mx-auto px-4 py-8 max-w-4xl`}>
        <div className="text-center mb-8">
          <h1 className="text-6xl mb-4">🍌 BANAMATIX 🍌</h1>
          <p className="text-xl text-gray-700">Solve the banana puzzle from the image below!</p>
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-gray-700">Welcome, {currentUser}!</p>
              </div>
              <Button
                onClick={storeRedirect}
                className="w-fit rounded-full border-2 hover:bg-white-600"
                variant="outline"
              >
                Store
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Play Mode</CardTitle>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <CardDescription>Guess correctly before you run out of attempts!</CardDescription>
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

            <div className="flex justify-center gap-4 mb-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {score}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-2">
                🍌 {coins}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="pt-6">
            {quiz ? <QuizImage quiz={quiz} /> : <p className="text-center">Loading quiz...</p>}

            <div className="mt-6 space-y-4">
              <div>
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
      </div>
    </>
  );
}
