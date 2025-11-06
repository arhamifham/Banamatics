import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Coins, Crown, Sword, ChefHat, Sparkles, Shield, Wand2, ArrowLeft, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface StoreItem {
  id: string;
  name: string;
  price: number;
  icon: any;
  type: 'decoration' | 'theme';
  description: string;
}

const storeItems: StoreItem[] = [
  { id: 'crown', name: 'Royal Crown', price: 50, icon: Crown, type: 'decoration', description: 'Show your royal status!' },
  { id: 'sword', name: 'Legendary Sword', price: 75, icon: Sword, type: 'decoration', description: 'For true warriors!' },
  { id: 'chef-hat', name: 'Chef Hat', price: 40, icon: ChefHat, type: 'decoration', description: 'Cook up some math!' },
  { id: 'shield', name: 'Golden Shield', price: 60, icon: Shield, type: 'decoration', description: 'Defend your high score!' },
  { id: 'wand', name: 'Magic Wand', price: 80, icon: Wand2, type: 'decoration', description: 'Cast math spells!' },
  { id: 'sparkles', name: 'Sparkle Effect', price: 30, icon: Sparkles, type: 'decoration', description: 'Add some shine!' },
];

const themes = [
  { id: 'ocean', name: 'Ocean Blue', price: 100, description: 'Dive into the deep blue sea' },
  { id: 'forest', name: 'Forest Green', price: 100, description: 'Nature-inspired calm' },
  { id: 'sunset', name: 'Sunset Orange', price: 120, description: 'Warm and vibrant colors' },
  { id: 'galaxy', name: 'Galaxy Purple', price: 150, description: 'Explore the cosmos' },
  { id: 'candy', name: 'Candy Land', price: 130, description: 'Sweet and colorful' },
];

export function StorePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [coins, setCoins] = useState(0);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default']);

  useEffect(() => {
    const user = localStorage.getItem('banamatix_current_user');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const users = JSON.parse(localStorage.getItem('banamatix_users') || '{}');
    if (users[user]) {
      setCoins(users[user].coins || 0);
      setOwnedItems(users[user].items || []);
      setOwnedThemes(users[user].themes || ['default']);
    }
  }, [navigate]);

  const purchaseItem = (item: StoreItem) => {
    if (coins < item.price) {
      toast.error('Not enough banana coins! 🍌');
      return;
    }

    if (ownedItems.includes(item.id)) {
      toast.error('You already own this item!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('banamatix_users') || '{}');
    if (users[currentUser]) {
      users[currentUser].coins = coins - item.price;
      users[currentUser].items = [...ownedItems, item.id];
      localStorage.setItem('banamatix_users', JSON.stringify(users));
      
      setCoins(coins - item.price);
      setOwnedItems([...ownedItems, item.id]);
      toast.success(`Purchased ${item.name}! 🎉`);
    }
  };

  const purchaseTheme = (theme: { id: string; name: string; price: number; description: string }) => {
    if (coins < theme.price) {
      toast.error('Not enough banana coins! 🍌');
      return;
    }

    if (ownedThemes.includes(theme.id)) {
      toast.error('You already own this theme!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('banamatix_users') || '{}');
    if (users[currentUser]) {
      users[currentUser].coins = coins - theme.price;
      users[currentUser].themes = [...ownedThemes, theme.id];
      localStorage.setItem('banamatix_users', JSON.stringify(users));
      
      setCoins(coins - theme.price);
      setOwnedThemes([...ownedThemes, theme.id]);
      toast.success(`Unlocked ${theme.name} theme! 🎨`);
    }
  };

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
