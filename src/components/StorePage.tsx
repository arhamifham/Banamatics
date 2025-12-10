import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Coins, Sparkles, Shield, Crown, Sword, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { THEMES } from "./themeConfig";
import { useTheme } from "./ThemeContext";

export function StorePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState("");
  const [coins, setCoins] = useState(0);
  const [ownedThemes, setOwnedThemes] = useState<string[]>(["default"]);
  const { applyTheme } = useTheme();
  const API_BASE = "http://localhost:8001/banamatix_backend";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("banamatix_current_user") || "{}");
    if (!stored.username) {
      navigate("/login");
      return;
    }

    setUser(stored);
    setCurrentUser(stored.username);
    setCoins(stored.coins || 0);
    setOwnedThemes(stored.themes ? stored.themes.split(",") : ["default"]);

    if (stored.themes_s) {
      const saved = THEMES.find((t) => t.id === String(stored.themes_s));
      if (saved) applyTheme(saved);
    }

  }, [navigate]);


  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);



  const logout = () => {
    localStorage.removeItem('banamatix_current_user');
    localStorage.removeItem('auth_token');
    navigate('/login');
  };


  // update user on backend and localStorage
  const updateUserData = async (updated: any) => {
    const updatedUser = { ...user, ...updated };

    localStorage.setItem("banamatix_current_user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    try {
      await fetch(`${API_BASE}/update_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
    } catch {
      toast.error("⚠️ Failed to sync with server");
    }
  };

  //Apply the selected theme
  const applySelectedTheme = async (themeId: string) => {
    const selected = THEMES.find((t) => t.id === themeId);
    if (!selected) return;

    applyTheme(selected);
    try {
      await fetch(`${API_BASE}/update_theme.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, theme: themeId }),
      });
    } catch {
    }

    // update local and backend user record for selected theme
    updateUserData({ themes_s: themeId });
    toast.success(`Theme applied: ${selected.name} 🎨`);
  };

  //Purchase and update backend for the theme
  const purchaseTheme = (t: any) => {
    if (coins < t.price) return toast.error("Not enough coins!");
    if (ownedThemes.includes(t.id)) return toast.error("Already unlocked!");

    const newCoins = coins - t.price;
    const newThemes = [...ownedThemes, t.id];

    setCoins(newCoins);
    setOwnedThemes(newThemes);

    updateUserData({
      coins: newCoins,
      themes: newThemes.join(","),
      themes_s: t.id,
    });

    toast.success(`Theme '${t.name}' unlocked! 🌈`);
  };

  return (
    <div className="theme-wrapper container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl mb-2 title">🍌 Banana Store 🍌</h1>
          <p className="text-gray-700 title">Welcome, {currentUser}!</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/game")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Game
        </Button>
      </div>

      <Card className="mb-6 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Coins className="w-8 h-8 text-yellow-600" />
            Your Banana Coins: {coins}
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="themes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((t) => {
              const owned = ownedThemes.includes(t.id);
              return (
                <Card key={t.id} className={`bg-white/90 backdrop-blur ${owned ? "border-green-500 border-2" : ""}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Sparkles className="w-12 h-12 text-purple-600" />
                      {owned && <Badge variant="secondary">UNLOCKED</Badge>}
                    </div>
                    <CardTitle>{t.name}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="text-xl">{t.price}</span>
                      </div>
                      <Button onClick={() => (owned ? applySelectedTheme(t.id) : purchaseTheme(t))} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        {owned ? "Apply Theme" : `Unlock (${t.price})`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
