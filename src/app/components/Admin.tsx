import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AdminStorage, AdminOrder, AdminSeller } from '../../utils/adminStorage';
import * as XLSX from 'xlsx';

type Tab = 'overview' | 'sellers' | 'buyers' | 'orders';

interface Buyer {
  email: string;
  name: string;
  orders: AdminOrder[];
  totalSpent: number;
}

export const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    const load = async () => {
      setLoading(true);
      const [allOrders, allSellers, revenue] = await Promise.all([
        AdminStorage.getOrders(),
        AdminStorage.getSellers(),
        AdminStorage.getTotalRevenue(),
      ]);
      setOrders(allOrders);
      setSellers(allSellers);
      setTotalRevenue(revenue);
      const buyerMap = new Map<string, Buyer>();
      allOrders.forEach(o => {
        if (!buyerMap.has(o.buyerEmail)) {
          buyerMap.set(o.buyerEmail, { email: o.buyerEmail, name: o.buyerName, orders: [], totalSpent: 0 });
        }
        const b = buyerMap.get(o.buyerEmail)!;
        b.orders.push(o);
        b.totalSpent += o.price * o.quantity;
      });
      setBuyers(Array.from(buyerMap.values()));
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) return null;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'sellers', label: '🏪 Sellers', count: sellers.length },
    { key: 'buyers', label: '🛒 Buyers', count: buyers.length },
    { key: 'orders', label: '🧾 Orders', count: orders.length },
  ];

  const exportToExcel = (sheetData: any[], filename: string, sheetName: string) => {
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  };

  const exportOrders = () => {
    const data = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).map(o => ({
      'Order ID': o.orderId,
      'Transaction ID': o.transactionId,
      'Buyer Name': o.buyerName,
      'Buyer Email': o.buyerEmail,
      'Product': o.productName,
      'Seller Name': o.sellerName,
      'Seller Email': o.sellerEmail,
      'Amount (₹)': o.price * o.quantity,
      'Delivery Address': o.deliveryAddress,
      'Payment Method': o.paymentMethod,
      'Source': o.source,
      'Date': new Date(o.placedAt).toLocaleString(),
    }));
    exportToExcel(data, 'upcycle_orders.xlsx', 'Orders');
  };

  const exportSellers = () => {
    const data = sellers.map(s => ({
      'Name': s.name,
      'Email': s.email,
      'WhatsApp': s.whatsapp || '—',
      'Product': s.productName,
      'Material': s.materialType,
      'Price (₹)': s.price,
      'Listed On': new Date(s.listedAt).toLocaleString(),
    }));
    exportToExcel(data, 'upcycle_sellers.xlsx', 'Sellers');
  };

  const exportBuyers = () => {
    const data = buyers.map(b => ({
      'Name': b.name,
      'Email': b.email,
      'Total Orders': b.orders.length,
      'Total Spent (₹)': b.totalSpent,
      'Last Order': new Date(b.orders[b.orders.length - 1].placedAt).toLocaleString(),
    }));
    exportToExcel(data, 'upcycle_buyers.xlsx', 'Buyers');
  };

  const exportAll = () => {
    const wb = XLSX.utils.book_new();

    const ordersData = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).map(o => ({
      'Order ID': o.orderId, 'Transaction ID': o.transactionId,
      'Buyer Name': o.buyerName, 'Buyer Email': o.buyerEmail,
      'Product': o.productName, 'Seller Name': o.sellerName,
      'Amount (₹)': o.price * o.quantity, 'Delivery Address': o.deliveryAddress,
      'Payment Method': o.paymentMethod, 'Source': o.source,
      'Date': new Date(o.placedAt).toLocaleString(),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordersData), 'Orders');

    const sellersData = sellers.map(s => ({
      'Name': s.name, 'Email': s.email, 'WhatsApp': s.whatsapp || '—',
      'Product': s.productName, 'Material': s.materialType,
      'Price (₹)': s.price, 'Listed On': new Date(s.listedAt).toLocaleString(),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sellersData), 'Sellers');

    const buyersData = buyers.map(b => ({
      'Name': b.name, 'Email': b.email,
      'Total Orders': b.orders.length, 'Total Spent (₹)': b.totalSpent,
      'Last Order': new Date(b.orders[b.orders.length - 1].placedAt).toLocaleString(),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(buyersData), 'Buyers');

    XLSX.writeFile(wb, 'upcycle_admin_data.xlsx');
  };

  const th = 'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide';
  const td = 'px-4 py-3 text-sm';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">UPCYCLE Admin</h1>
          <p className="text-gray-400 text-xs">Admin Dashboard — all activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportAll}
            className="text-sm text-white bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
            ⬇ Export All
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-gray-300 hover:text-white border border-gray-600 px-3 py-1.5 rounded-lg">
            Logout
          </button>
        </div>
      </div>

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
        {loading && <p className="text-center text-gray-400 py-20">Loading data...</p>}

        {!loading && tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Sellers', value: sellers.length, icon: '🏪' },
              { label: 'Total Buyers', value: buyers.length, icon: '🛒' },
              { label: 'Total Orders', value: orders.length, icon: '🧾' },
              { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰' },
              { label: 'Website Orders', value: orders.filter(o => o.source === 'website').length, icon: '🌐' },
              { label: 'Chatbot Orders', value: orders.filter(o => o.source === 'chatbot').length, icon: '🤖' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1">
                <span className="text-2xl">{card.icon}</span>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'sellers' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={exportSellers} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 flex items-center gap-1">
                ⬇ Export Sellers (.xlsx)
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Name','Email','WhatsApp','Product','Material','Price','Listed On'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sellers.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No sellers yet</td></tr>}
                  {sellers.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className={`${td} font-medium`}>{s.name}</td>
                      <td className={`${td} text-gray-600`}>{s.email}</td>
                      <td className={`${td} text-gray-500`}>{s.whatsapp || '—'}</td>
                      <td className={td}>{s.productName}</td>
                      <td className={`${td} text-gray-500`}>{s.materialType}</td>
                      <td className={`${td} font-semibold`}>₹{s.price}</td>
                      <td className={`${td} text-gray-400`}>{new Date(s.listedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'buyers' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={exportBuyers} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 flex items-center gap-1">
                ⬇ Export Buyers (.xlsx)
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Name','Email','Orders','Total Spent','Last Order'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {buyers.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No buyers yet</td></tr>}
                  {buyers.map(b => (
                    <tr key={b.email} className="hover:bg-gray-50">
                      <td className={`${td} font-medium`}>{b.name}</td>
                      <td className={`${td} text-gray-600`}>{b.email}</td>
                      <td className={td}><span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{b.orders.length} orders</span></td>
                      <td className={`${td} font-semibold text-green-700`}>₹{b.totalSpent}</td>
                      <td className={`${td} text-gray-400`}>{new Date(b.orders[b.orders.length - 1].placedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'orders' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={exportOrders} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 flex items-center gap-1">
                ⬇ Export Orders (.xlsx)
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Order ID','Buyer','Product','Seller','Amount','Address','Method','Source','Date'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No orders yet</td></tr>}
                  {[...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).map((o, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className={td}>
                        <p className="font-mono text-xs font-semibold">{o.orderId}</p>
                        <p className="font-mono text-xs text-gray-400">{o.transactionId}</p>
                      </td>
                      <td className={td}><p className="font-medium">{o.buyerName}</p><p className="text-xs text-gray-400">{o.buyerEmail}</p></td>
                      <td className={td}>{o.productName}</td>
                      <td className={`${td} text-gray-500`}>{o.sellerName}</td>
                      <td className={`${td} font-semibold text-green-700`}>₹{o.price * o.quantity}</td>
                      <td className={`${td} text-gray-500 max-w-[120px] truncate`}>{o.deliveryAddress}</td>
                      <td className={`${td} text-gray-500`}>{o.paymentMethod}</td>
                      <td className={td}>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${o.source === 'website' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {o.source === 'website' ? '🌐 Web' : '🤖 Chat'}
                        </span>
                      </td>
                      <td className={`${td} text-gray-400`}>{new Date(o.placedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
