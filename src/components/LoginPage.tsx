//UI structure is generated through figma AI plugin
import { useState, useEffect } from 'react';
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

  const [passwordError, setPasswordError] = useState("");

  const backendURL = 'http://localhost:8001/banamatix_backend/';

  const GOOGLE_CLIENT_ID = "755334656652-gsegqbdf3qdqj7m4iltkdhqf7oanq37r.apps.googleusercontent.com";

  // Validates password strength against security requirements (8+ chars, uppercase, lowercase, number, special char)
  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < 8) return "Must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain an uppercase letter (A-Z)";
    if (!/[a-z]/.test(password)) return "Must contain a lowercase letter (a-z)";
    if (!/[0-9]/.test(password)) return "Must contain a number (0-9)";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Must contain a special symbol (!@#$% etc)";
    return "";

    return (
      minLength.test(password) &&
      upper.test(password) &&
      lower.test(password) &&
      number.test(password) &&
      special.test(password)
    );
  };


  // Initializes Google Sign-In button and renders it to the DOM
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          {
            theme: "outline",
            size: "large",
            shape: "pill",
          }
        );
        clearInterval(interval);
      }
    }, 500);
  }, []);

  // Handles Google OAuth response, sends JWT token to backend for verification and authentication
  function handleGoogleResponse(response) {
    const jwt = response.credential;

    // send google token to backend for verification
    fetch("http://localhost:8001/banamatix_backend/google_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: jwt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem(
            "banamatix_current_user",
            JSON.stringify(data.user)
          );
          navigate("/game");
        } else {
          toast.error("Google login failed");
        }
      });
  }
  // Authenticates user with username and password, stores session token and user data
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
        localStorage.setItem("auth_token", data.token);
        navigate('/game');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Server connection error');
    }
  };
  // Creates new user account with email, username, and validated password
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
// Validate password strength
    try {
      const res = await fetch(`${backendURL}register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Registration successful 🎉');
        navigate('/game');
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
                <div id="googleSignInDiv"></div>
                <Button type="submit" variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
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
                    onChange={(e) => {
                      const newPass = e.target.value;
                      setRegisterData({ ...registerData, password: newPass });
                      setPasswordError(validatePassword(newPass));
                    }}
                    placeholder="Create a password"
                  />

                  {passwordError && (
                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                  )}
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
                <Button type="submit" variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black bo">
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
