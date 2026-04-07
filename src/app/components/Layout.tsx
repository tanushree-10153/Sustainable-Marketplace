import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { WhatsAppButton } from './WhatsAppButton';

export const Layout = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBuyerPage = location.pathname === '/buyer';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    alert('Successfully logged out.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xl font-semibold tracking-tight">UPCYCLE</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/seller" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Sell
              </Link>
              <Link to="/buyer" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              {!isAuthenticated ? (
                <>
                  {!isBuyerPage && (
                    <>
                      <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                        Login
                      </Link>
                      <Link to="/register" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                        Register
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                to="/"
                className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/seller"
                className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell
              </Link>
              <Link
                to="/buyer"
                className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              {!isAuthenticated ? (
                <>
                  {!isBuyerPage && (
                    <>
                      <Link
                        to="/login"
                        className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors w-full text-left"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      <WhatsAppButton />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">UPCYCLE</h3>
              <p className="text-sm text-gray-600">
                Transform old clothes into sustainable lifestyle products.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-gray-600 hover:text-black">
                  About Us
                </Link>
                <Link to="/buyer" className="block text-sm text-gray-600 hover:text-black">
                  Shop
                </Link>
                <Link to="/seller" className="block text-sm text-gray-600 hover:text-black">
                  Sell Products
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Contact</h3>
              <p className="text-sm text-gray-600">Email: support@upcycle.com</p>
              <p className="text-sm text-gray-600">Phone: 9920678921</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2026 UPCYCLE. All rights reserved. Sustainable Fashion Marketplace.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
