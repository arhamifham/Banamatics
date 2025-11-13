import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

export function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const backendURL = 'http://localhost:8001/banamatix_backend/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${backendURL}login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Login successful 🎉');
        localStorage.setItem('banamatix_current_user', JSON.stringify(data.user));
        navigate('/game');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Server connection error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.username || !registerData.email || !registerData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${backendURL}register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Registration successful 🎉');
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Server connection error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-6xl mb-4">🍌 BANAMATIX 🍌</h1>
        <p className="text-xl text-gray-700">Join the banana math adventure!</p>
      </div>

      <Tabs defaultValue="login" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Welcome Back!</CardTitle>
              <CardDescription>Login to continue your banana math journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Register to unlock the full game experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    placeholder="Choose a username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                  />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
