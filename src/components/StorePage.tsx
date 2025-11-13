import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Coins, Sparkles, Shield, Crown, Sword, ChefHat, Wand2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function StorePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState('');
  const [coins, setCoins] = useState(0);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default']);

  const API_BASE = "http://localhost:8001/banamatix_backend";

  // 🧠 Load user from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('banamatix_current_user') || '{}');
    if (!stored.username) {
      navigate('/login');
      return;
    }

    setUser(stored);
    setCurrentUser(stored.username);
    setCoins(stored.coins || 0);
    setOwnedThemes(stored.theme ? [stored.theme] : ['default']);
  }, [navigate]);

  // 🔁 Update backend when user data changes
  const updateUserData = async (updates: any) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('banamatix_current_user', JSON.stringify(updated));
    setUser(updated);

    try {
      await fetch(`${API_BASE}/update_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {
      toast.error("⚠️ Failed to sync with server");
    }
  };

  // 🛍️ Purchase item logic
  const purchaseItem = (item: any) => {
    if (coins < item.price) return toast.error("Not enough coins!");
    if (ownedItems.includes(item.id)) return toast.error("Already owned!");

    const newCoins = coins - item.price;
    const newItems = [...ownedItems, item.id];
    setCoins(newCoins);
    setOwnedItems(newItems);
    updateUserData({ coins: newCoins, items: JSON.stringify(newItems) });
    toast.success(`Purchased ${item.name}! 🎉`);
  };

  // 🎨 Purchase theme logic
  const purchaseTheme = (theme: any) => {
    if (coins < theme.price) return toast.error("Not enough coins!");
    if (ownedThemes.includes(theme.id)) return toast.error("Already unlocked!");

    const newCoins = coins - theme.price;
    const newThemes = [...ownedThemes, theme.id];
    setCoins(newCoins);
    setOwnedThemes(newThemes);
    updateUserData({ coins: newCoins, theme: theme.id });
    toast.success(`Theme '${theme.name}' unlocked! 🌈`);
  };

  // 🪙 Store items
  const storeItems = [
    { id: 'sword', name: 'Golden Sword', price: 50, description: 'A shiny banana sword.', icon: Sword },
    { id: 'shield', name: 'Banana Shield', price: 40, description: 'Protects your bananas.', icon: Shield },
    { id: 'chef', name: 'Chef Hat', price: 30, description: 'Banana cooking master.', icon: ChefHat },
    { id: 'wand', name: 'Magic Wand', price: 70, description: 'Turn bananas into gold.', icon: Wand2 },
  ];

  const themes = [
    { id: 'default', name: 'Default Theme', price: 0, description: 'Classic banana vibe.' },
    { id: 'dark', name: 'Dark Jungle', price: 100, description: 'Play in banana night mode.' },
    { id: 'royal', name: 'Royal Banana', price: 150, description: 'Golden royal theme.', icon: Crown },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl mb-2">🍌 Banana Store 🍌</h1>
          <p className="text-gray-700">Welcome, {currentUser}!</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/game')}>
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

      <Tabs defaultValue="decorations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decorations">Decorative Items</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="decorations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeItems.map((item) => {
              const Icon = item.icon;
              const owned = ownedItems.includes(item.id);

              return (
                <Card key={item.id} className={`bg-white/90 backdrop-blur ${owned ? 'border-green-500 border-2' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Icon className="w-12 h-12 text-yellow-600" />
                      {owned && <Badge variant="secondary">OWNED</Badge>}
                    </div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="text-xl">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => purchaseItem(item)}
                        disabled={owned}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {owned ? 'Owned' : 'Buy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const owned = ownedThemes.includes(theme.id);

              return (
                <Card key={theme.id} className={`bg-white/90 backdrop-blur ${owned ? 'border-green-500 border-2' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Sparkles className="w-12 h-12 text-purple-600" />
                      {owned && <Badge variant="secondary">UNLOCKED</Badge>}
                    </div>
                    <CardTitle>{theme.name}</CardTitle>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="text-xl">{theme.price}</span>
                      </div>
                      <Button
                        onClick={() => purchaseTheme(theme)}
                        disabled={owned}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {owned ? 'Unlocked' : 'Unlock'}
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
