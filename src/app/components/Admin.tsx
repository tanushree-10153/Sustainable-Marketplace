import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ProductStorage } from '../../utils/productStorage';

interface RegisteredUser {
  name: string;
  email: string;
  whatsapp: string;
  registrationDate: string;
}

interface Product {
  id: any;
  productName: string;
  sellerName: string;
  sellerEmail: string;
  materialType: string;
  price: number;
  uploadDate: string;
  imageUrl: string;
}

interface ChatOrder {
  orderId: string;
  transactionId: string;
  vendorEmail: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  deliveryAddress: string;
  placedAt: string;
}

type Tab = 'overview' | 'sellers' | 'buyers' | 'products' | 'orders';

export const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ChatOrder[]>([]);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    // Load registered users
    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(stored);
    // Load products
    ProductStorage.loadProducts().then(setProducts);
    // Load all vendor chat orders from localStorage
    const allOrders: ChatOrder[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('vendor_session_')) {
        try {
          const session = JSON.parse(localStorage.getItem(k) || '{}');
          if (session.orders) allOrders.push(...session.orders);
        } catch {}
      }
    }
    setOrders(allOrders);
  }, [isAdmin]);

  if (!isAdmin) return null;

  // Derive sellers = users who have at least one product listed
  const sellerEmails = new Set(products.map(p => p.sellerEmail));
  const sellers = users.filter(u => sellerEmails.has(u.email));

  // Derive buyers = users who have placed at least one chat order
  const buyerEmails = new Set(orders.map(o => o.vendorEmail));
  const buyers = users.filter(u => buyerEmails.has(u.email));

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'sellers', label: '🏪 Sellers', count: sellers.length },
    { key: 'buyers', label: '🛒 Buyers', count: buyers.length },
    { key: 'products', label: '📦 Products', count: products.length },
    { key: 'orders', label: '🧾 Orders', count: orders.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">UPCYCLE Admin</h1>
          <p className="text-gray-400 text-xs">Admin Dashboard</p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }}
          className="text-sm text-gray-300 hover:text-white border border-gray-600 px-3 py-1.5 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Registered Users', value: users.length, icon: '👥' },
              { label: 'Active Sellers', value: sellers.length, icon: '🏪' },
              { label: 'Active Buyers', value: buyers.length, icon: '🛒' },
              { label: 'Total Products', value: products.length, icon: '📦' },
              { label: 'Total Orders', value: orders.length, icon: '🧾' },
              { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1">
                <span className="text-2xl">{card.icon}</span>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sellers */}
        {tab === 'sellers' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'WhatsApp', 'Registered', 'Products Listed'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sellers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No sellers yet</td></tr>
                )}
                {sellers.map(u => (
                  <tr key={u.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.whatsapp || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(u.registrationDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {products.filter(p => p.sellerEmail === u.email).length} products
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buyers */}
        {tab === 'buyers' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'WhatsApp', 'Orders', 'Total Spent'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No buyers yet</td></tr>
                )}
                {buyers.map(u => {
                  const userOrders = orders.filter(o => o.vendorEmail === u.email);
                  const spent = userOrders.reduce((s, o) => s + o.total, 0);
                  return (
                    <tr key={u.email} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.whatsapp || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {userOrders.length} orders
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-700">₹{spent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Product', 'Seller', 'Material', 'Price', 'Listed On'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No products yet</td></tr>
                )}
                {products.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.productName} className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'; }} />
                        <span className="font-medium">{p.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.sellerName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.materialType}</td>
                    <td className="px-4 py-3 font-semibold">₹{p.price}</td>
                    <td className="px-4 py-3 text-gray-500">{p.uploadDate ? new Date(p.uploadDate).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order ID', 'Buyer', 'Items', 'Total', 'Address', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No orders yet</td></tr>
                )}
                {orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold">{o.orderId}</p>
                      <p className="font-mono text-xs text-gray-400">{o.transactionId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.vendorEmail}</td>
                    <td className="px-4 py-3 text-gray-500">{o.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{o.total}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{o.deliveryAddress}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(o.placedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
