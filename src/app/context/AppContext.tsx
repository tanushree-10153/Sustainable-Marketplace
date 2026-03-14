import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  sellerName: string;
  sellerEmail: string;
  materialType: string;
  productName: string;
  description: string;
  imageUrl: string;
  price: number;
  uploadDate: string;
}

interface Order {
  id: string;
  buyerEmail: string;
  productId: string;
  productName: string;
  price: number;
  paymentStatus: string;
  orderDate: string;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'uploadDate'>) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => void;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize with demo products
  useEffect(() => {
    const demoProducts: Product[] = [
      {
        id: '1',
        sellerName: 'Emma Wilson',
        sellerEmail: 'emma@example.com',
        materialType: 'Denim',
        productName: 'Upcycled Denim Tote Bag',
        description: 'Stylish tote bag made from repurposed denim jeans. Perfect for daily use with spacious interior.',
        imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800',
        price: 45,
        uploadDate: '2026-03-08'
      },
      {
        id: '2',
        sellerName: 'James Chen',
        sellerEmail: 'james@example.com',
        materialType: 'Cotton',
        productName: 'Vintage Patchwork Cushion',
        description: 'Handcrafted cushion cover made from vintage cotton fabrics. Adds character to any space.',
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
        price: 32,
        uploadDate: '2026-03-07'
      },
      {
        id: '3',
        sellerName: 'Sofia Martinez',
        sellerEmail: 'sofia@example.com',
        materialType: 'Wool',
        productName: 'Cozy Upcycled Blanket',
        description: 'Warm blanket created from repurposed wool sweaters. Eco-friendly and incredibly soft.',
        imageUrl: 'https://images.unsplash.com/photo-1631049035634-c04759e9e8b3?w=800',
        price: 78,
        uploadDate: '2026-03-06'
      },
      {
        id: '4',
        sellerName: 'Alex Thompson',
        sellerEmail: 'alex@example.com',
        materialType: 'Leather',
        productName: 'Minimalist Leather Wallet',
        description: 'Sleek wallet crafted from upcycled leather jackets. Durable and timeless design.',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        price: 55,
        uploadDate: '2026-03-05'
      }
    ];
    setProducts(demoProducts);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email: email
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate registration
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addProduct = (product: Omit<Product, 'id' | 'uploadDate'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const addOrder = (order: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderDate: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      products,
      orders,
      login,
      register,
      logout,
      addProduct,
      addOrder,
      getProductById
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
