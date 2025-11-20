import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Толстовка Premium', price: 4990, category: 'men', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg' },
  { id: 2, name: 'Худи Comfort', price: 3990, category: 'women', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/65178f56-1b3a-48d6-bc99-340a0ecad011.jpg' },
  { id: 3, name: 'Свитшот Kids', price: 2990, category: 'kids', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg' },
  { id: 4, name: 'Парные худи Love', price: 8990, category: 'couples', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg' },
  { id: 5, name: 'Толстовка Classic', price: 4490, category: 'men', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/65178f56-1b3a-48d6-bc99-340a0ecad011.jpg' },
  { id: 6, name: 'Худи Elegant', price: 4290, category: 'women', image: 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg' },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCatalog, setShowCatalog] = useState(false);

  const categories = [
    { id: 'all', name: 'Все товары', icon: 'Grid3x3' },
    { id: 'men', name: 'Мужчинам', icon: 'User' },
    { id: 'women', name: 'Женщинам', icon: 'User' },
    { id: 'kids', name: 'Детям', icon: 'Baby' },
    { id: 'couples', name: 'Парам', icon: 'Heart' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider">SHEEPPERS</h1>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setShowCatalog(false)} className="text-sm hover:text-primary transition-colors">
              Главная
            </button>
            <button onClick={() => setShowCatalog(true)} className="text-sm hover:text-primary transition-colors">
              Каталог
            </button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-card rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                              <Icon name="Minus" size={12} />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                              <Icon name="Plus" size={12} />
                            </Button>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold">Итого:</span>
                        <span className="font-bold text-xl">{totalPrice.toLocaleString()} ₽</span>
                      </div>
                      <Button className="w-full" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {!showCatalog ? (
        <>
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/83defc41-1c0f-4da1-8fca-892b1937cf51.jpg)`,
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative z-10 text-center px-4 animate-fade-in">
              <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-wider">SHEEPPERS</h2>
              <p className="text-xl md:text-2xl mb-4 text-gray-200">Комфорт в каждой детали</p>
              <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
                Мы создаём одежду, которая дарит уют и стиль каждый день
              </p>
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => setShowCatalog(true)}>
                Открыть каталог
              </Button>
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button className="text-white/60 hover:text-white transition-colors">
                <Icon name="Instagram" size={24} />
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <Icon name="Twitter" size={24} />
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <Icon name="Facebook" size={24} />
              </button>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto max-w-4xl text-center animate-slide-up">
              <h3 className="text-4xl font-bold mb-8">Наша история</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Sheeppers начался с простой идеи — создать одежду, в которой каждый чувствует себя как дома. 
                Мы верим, что комфорт и стиль идут рука об руку, и каждая вещь должна рассказывать свою историю.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Сегодня мы предлагаем коллекции для всей семьи, включая уникальные парные комплекты, 
                которые объединяют близких людей через стиль и комфорт.
              </p>
            </div>
          </section>
        </>
      ) : (
        <section className="pt-24 pb-16 px-4 min-h-screen">
          <div className="container mx-auto">
            <h2 className="text-5xl font-bold mb-12 text-center animate-fade-in">Каталог</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2"
                >
                  <Icon name={cat.icon as any} size={18} />
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
              {filteredProducts.map((product, idx) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">{product.price.toLocaleString()} ₽</p>
                    <Button className="w-full" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-secondary/50 py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">SHEEPPERS</h2>
          <p className="text-muted-foreground mb-6">Комфорт в каждой детали</p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Twitter" size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Sheeppers. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
