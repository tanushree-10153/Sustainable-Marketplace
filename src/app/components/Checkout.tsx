import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { ProductStorage } from '../../utils/productStorage';
import { sendEmail } from '../../utils/emailService';

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

export const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login to make a purchase');
      navigate('/login');
      return;
    }

    const products = ProductStorage.loadProducts();
    const foundProduct = products.find((p: Product) => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/buyer');
    }
  }, [id, navigate, isAuthenticated]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
      }
    } else {
      if (!upiId) {
        alert('Please enter your UPI ID');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (product && user) {
        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
          id: Date.now(),
          buyerEmail: user.email,
          productName: product.productName,
          price: product.price,
          orderDate: new Date().toISOString(),
          paymentStatus: 'Completed',
          paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI',
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        sendEmail({
          user_name: user.name,
          user_email: user.email,
          subject: 'Order Confirmed',
          message: `Hi ${user.name}, your order for "${product.productName}" has been confirmed. You paid ₹${product.price} via ${paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}. Thank you for your purchase!`,
        });

        setProcessing(false);
        setSuccess(true);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    }, 2000);
  };

  if (!product || !user) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You will be redirected to your dashboard.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order Summary</p>
              <p className="font-semibold text-lg">{product.productName}</p>
              <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  UPI
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setExpiryDate(value);
                          }}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      placeholder="yourname@upi"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing Payment...' : `Pay ₹${product.price}`}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  This is a demo payment system. No real transactions will be processed. For testing,
                  use any card number (e.g., 1234 5678 9012 3456).
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="mb-6">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300?text=Product+Image';
                  }}
                />
                <h3 className="font-semibold text-lg mb-2">{product.productName}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.materialType}</p>
                <p className="text-sm text-gray-500">Seller: {product.sellerName}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{product.price}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🌱 This purchase supports sustainable fashion and reduces textile waste
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
