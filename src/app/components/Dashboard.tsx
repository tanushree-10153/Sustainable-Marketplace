import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { ProductStorage } from '../../utils/productStorage';

interface Product {
  id: number;
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
  id: number;
  buyerEmail: string;
  productName: string;
  price: number;
  orderDate: string;
  paymentStatus: string;
}

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's products
    const allProducts = ProductStorage.loadProducts();
    const userProducts = allProducts.filter((p: Product) => p.sellerEmail === user?.email);
    setMyProducts(userProducts);

    // Load user's orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter((o: Order) => o.buyerEmail === user?.email);
    setMyOrders(userOrders);
  }, [isAuthenticated, navigate, user?.email]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-300">Email: {user.email}</p>
          <p className="text-gray-300">Member since: {new Date(user.registrationDate).toLocaleDateString()}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{myProducts.length}</h3>
            <p className="text-gray-600 text-sm">Total Uploaded Products</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{myOrders.length}</h3>
            <p className="text-gray-600 text-sm">Total Purchases</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {myProducts.length + myOrders.length}
            </h3>
            <p className="text-gray-600 text-sm">Recent Activity</p>
          </div>
        </div>

        {/* My Products Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">My Uploaded Products</h2>
          {myProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't uploaded any products yet</p>
              <button
                onClick={() => navigate('/seller')}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Upload Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.materialType}</p>
                    <h3 className="font-semibold mb-2">{product.productName}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold">₹{product.price}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded: {new Date(product.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Orders Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Purchases</h2>
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't made any purchases yet</p>
              <button
                onClick={() => navigate('/buyer')}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{order.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Order Date: {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Payment Status: {order.paymentStatus}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{order.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
