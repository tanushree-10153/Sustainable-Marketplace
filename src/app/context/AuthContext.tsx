import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendEmail } from '../../utils/emailService';

interface User {
  name: string;
  email: string;
  registrationDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      alert('Email already registered');
      return false;
    }

    const newUser = {
      name,
      email,
      password,
      registrationDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Simulate email notification
    console.log(`✉️ Email sent to admin: New user registered - ${name} (${email})`);
    
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userData = {
        name: foundUser.name,
        email: foundUser.email,
        registrationDate: foundUser.registrationDate,
      };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      sendEmail({
        user_name: foundUser.name,
        user_email: foundUser.email,
        subject: 'Login Successful',
        message: `Hi ${foundUser.name}, you successfully logged in at ${new Date().toLocaleString()}. If this wasn't you, please contact support.`,
      });

      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
