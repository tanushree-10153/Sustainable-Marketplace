import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Lock, ShieldCheck, Smartphone, CreditCard, Building2, MapPin } from 'lucide-react';
import { ProductStorage } from '../../utils/productStorage';
import { sendEmail } from '../../utils/emailService';
import { AdminStorage } from '../../utils/adminStorage';

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

type PaymentMethod = 'card' | 'upi' | 'netbanking';

const UPI_APPS = [
  { name: 'GPay', color: 'bg-white border', icon: '🟢' },
  { name: 'PhonePe', color: 'bg-white border', icon: '🟣' },
  { name: 'Paytm', color: 'bg-white border', icon: '🔵' },
  { name: 'BHIM', color: 'bg-white border', icon: '🟠' },
];

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'];

export const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId] = useState(`ORD${Date.now().toString().slice(-8)}`);

  useEffect(() => {
    const load = async () => {
      const products = await ProductStorage.loadProducts();
      const foundProduct = products.find((p: Product) => p.id === Number(id));
      if (foundProduct) setProduct(foundProduct);
      else navigate('/buyer');
    };
    load();
  }, [id, navigate]);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      alert('Please fill in all card details');
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter your UPI ID');
      return;
    }
    if (paymentMethod === 'netbanking' && !selectedBank) {
      alert('Please select a bank');
      return;
    }
    if (!deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    const buyerName = user?.name || guestName;
    const buyerEmail = user?.email || guestEmail;

    if (!buyerName || !buyerEmail) {
      alert('Please enter your name and email');
      return;
    }

    setProcessing(true);
    setTimeout(async () => {
      if (product) {
        const methodLabel = paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking';
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          id: Date.now(), orderId, buyerEmail,
          productName: product.productName, price: product.price,
          orderDate: new Date().toISOString(), paymentStatus: 'Completed', paymentMethod: methodLabel,
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        await AdminStorage.saveOrder({
          orderId,
          transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          buyerName, buyerEmail,
          productName: product.productName,
          sellerName: product.sellerName,
          sellerEmail: product.sellerEmail,
          price: product.price, quantity: 1,
          deliveryAddress, paymentMethod: methodLabel,
          source: 'website', placedAt: new Date().toISOString(),
        });
        if (user) {
          sendEmail({
            user_name: buyerName, user_email: buyerEmail,
            subject: 'Order Confirmed',
            message: `Hi ${buyerName}, your order for "${product.productName}" (${orderId}) has been confirmed. You paid ₹${product.price}. Thank you!`,
          });
        }
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => navigate(user ? '/dashboard' : '/buyer'), 4000);
      }
    }, 2500);
  };

  if (!product || !user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Your order has been placed successfully</p>
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Product</span>
              <span className="font-semibold text-gray-800">{product.productName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-green-600 text-base">₹{product.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-green-600 font-semibold">✓ Confirmed</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">Redirecting to dashboard in a few seconds...</p>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 256-bit SSL encrypted payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-4">

            {/* Guest Info (shown only when not logged in) */}
            {!user && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Your Details</h2>
                <input
                  type="text" placeholder="Full Name" value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                  required
                />
                <input
                  type="email" placeholder="Email Address" value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm"
                  required
                />
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Delivery Address
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none text-sm"
                placeholder="Enter your full delivery address (house no, street, city, pincode)..."
                required
              />
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-2">
              {[
                { key: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
                { key: 'upi', label: 'UPI', icon: <Smartphone className="w-4 h-4" /> },
                { key: 'netbanking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key as PaymentMethod)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    paymentMethod === m.key ? 'bg-black text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment}>
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                {paymentMethod === 'card' && (
                  <>
                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white mb-2">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs opacity-60">UPCYCLE PAY</span>
                        <CreditCard className="w-8 h-8 opacity-60" />
                      </div>
                      <p className="text-lg font-mono tracking-widest mb-4">
                        {cardNumber ? cardNumber.padEnd(19, '•').replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between text-xs opacity-70">
                        <span>{cardName || 'CARD HOLDER'}</span>
                        <span>{expiryDate || 'MM/YY'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CARD NUMBER</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none font-mono text-lg tracking-widest"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CARDHOLDER NAME</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                        placeholder="NAME ON CARD"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">EXPIRY DATE</label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                            setExpiryDate(v);
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? 'text' : 'password'}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                            placeholder="•••"
                            maxLength={3}
                            required
                          />
                          <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-3.5 text-xs text-gray-400">
                            {showCvv ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-4 gap-3">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.name}
                          type="button"
                          onClick={() => setUpiId(`yourname@${app.name.toLowerCase()}`)}
                          className="flex flex-col items-center gap-1 p-3 border rounded-xl hover:border-black transition-colors"
                        >
                          <span className="text-2xl">{app.icon}</span>
                          <span className="text-xs text-gray-600">{app.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="relative flex items-center">
                      <div className="flex-1 border-t border-gray-200" />
                      <span className="px-3 text-xs text-gray-400">or enter UPI ID</span>
                      <div className="flex-1 border-t border-gray-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">UPI ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                          placeholder="yourname@upi"
                          required
                        />
                        <button type="button" className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">SELECT YOUR BANK</label>
                    <div className="grid grid-cols-2 gap-3">
                      {BANKS.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 border rounded-xl text-sm text-left transition-all ${
                            selectedBank === bank ? 'border-black bg-gray-50 font-medium' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          🏦 {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ₹{product.price} Securely</>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Demo payment — no real transaction will occur
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Summary</h2>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full aspect-square object-cover rounded-xl mb-4"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Product'; }}
              />
              <h3 className="font-semibold text-gray-900 mb-1">{product.productName}</h3>
              <p className="text-xs text-gray-500 mb-1">{product.materialType}</p>
              <p className="text-xs text-gray-400 mb-4">Sold by {product.sellerName}</p>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>₹{product.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span><span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span><span>₹0</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                  <span>Total</span><span>₹{product.price}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-700">🌱 This purchase supports sustainable fashion</p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-3 h-3" /> Secured by UPCYCLE Pay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
