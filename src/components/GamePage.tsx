import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Trophy, Coins, Store, LogOut } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QuizImage } from './QuizImage';
import { generateQuiz } from './utils/quizGenerator';

export function GamePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [answer, setAnswer] = useState('');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quiz, setQuiz] = useState(generateQuiz());
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('banamatix_current_user');
    if (!user) {
      // For testing: use a demo user instead of redirecting
      setCurrentUser('DemoPlayer');
      setHighScore(0);
      setCoins(0);
      // Uncomment the line below to enforce login:
      // navigate('/login');
      return;
    }
    setCurrentUser(user);

    const users = JSON.parse(localStorage.getItem('banamatix_users') || '{}');
    if (users[user]) {
      setHighScore(users[user].highScore || 0);
      setCoins(users[user].coins || 0);
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && lives > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || lives === 0) {
      endGame();
    }
  }, [timeLeft, isGameOver, lives]);

  const endGame = () => {
    if (isGameOver) return;
    
    setIsGameOver(true);
    const users = JSON.parse(localStorage.getItem('banamatix_users') || '{}');
    
    if (users[currentUser]) {
      const earnedCoins = Math.floor(score / 10);
      const newHighScore = Math.max(score, users[currentUser].highScore || 0);
      const newCoins = (users[currentUser].coins || 0) + earnedCoins;
      
      users[currentUser].highScore = newHighScore;
      users[currentUser].coins = newCoins;
      localStorage.setItem('banamatix_users', JSON.stringify(users));
      
      setHighScore(newHighScore);
      setCoins(newCoins);
      
      if (score > (users[currentUser].highScore || 0)) {
        toast.success(`New High Score! ${score} 🏆`);
      }
      toast.success(`Game Over! You earned ${earnedCoins} banana coins! 🍌`);
    }
  };

  const resetGame = () => {
    setLives(3);
    setScore(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setQuiz(generateQuiz());
    setAnswer('');
  };

  const handleSubmit = () => {
    if (!answer || isGameOver) return;

    if (parseInt(answer) === quiz.answer) {
      toast.success('Correct! +10 points 🎉');
      setScore(score + 10);
      setQuiz(generateQuiz());
      setAnswer('');
      setTimeLeft(60); // Reset timer on correct answer
    } else {
      setLives(lives - 1);
      toast.error(`Wrong answer! ${lives - 1} lives left`);
      setAnswer('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('banamatix_current_user');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl mb-2">🍌 BANAMATIX 🍌</h1>
          <p className="text-gray-700">Welcome, {currentUser}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/store')}>
            <Store className="w-4 h-4 mr-2" />
            Store
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              High Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{highScore}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Current Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{score}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-600" />
              Banana Coins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl">{coins}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-white/90 backdrop-blur">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-8 h-8 ${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Time Left</p>
              <p className="text-3xl">{timeLeft}s</p>
            </div>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {isGameOver ? (
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-4xl">Game Over!</h2>
            <p className="text-2xl">Final Score: {score}</p>
            <p className="text-xl">Banana Coins Earned: {Math.floor(score / 10)}</p>
            <Button 
              onClick={resetGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              size="lg"
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/90 backdrop-blur">
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
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                size="lg"
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
