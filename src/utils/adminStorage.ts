// Central admin data store — persisted to JSONBin (shared across all users/devices)

export interface AdminOrder {
  orderId: string;
  transactionId: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  sellerName: string;
  sellerEmail: string;
  price: number;
  quantity: number;
  deliveryAddress: string;
  paymentMethod: string;
  source: 'website' | 'chatbot';
  placedAt: string;
}

export interface AdminSeller {
  name: string;
  email: string;
  whatsapp: string;
  productName: string;
  materialType: string;
  price: number;
  listedAt: string;
}

const BIN_ID = '69bea2d3aa77b81da905fcab';
const API_KEY = '$2a$10$UbEjsZRD45In5eY.rr0umuUOFBJOS34UGwK006UJDImW1Y7m4.Eim';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY };

interface AdminData { orders: AdminOrder[]; sellers: AdminSeller[]; }

const fetchData = async (): Promise<AdminData> => {
  try {
    const res = await fetch(`${BASE_URL}/latest`, { headers: HEADERS });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return { orders: json.record?.orders || [], sellers: json.record?.sellers || [] };
  } catch {
    return {
      orders: JSON.parse(localStorage.getItem('admin_orders') || '[]'),
      sellers: JSON.parse(localStorage.getItem('admin_sellers') || '[]'),
    };
  }
};

const pushData = async (data: AdminData): Promise<void> => {
  try {
    await fetch(BASE_URL, { method: 'PUT', headers: HEADERS, body: JSON.stringify(data) });
    localStorage.setItem('admin_orders', JSON.stringify(data.orders));
    localStorage.setItem('admin_sellers', JSON.stringify(data.sellers));
  } catch {
    localStorage.setItem('admin_orders', JSON.stringify(data.orders));
    localStorage.setItem('admin_sellers', JSON.stringify(data.sellers));
  }
};

export const AdminStorage = {
  async getOrders(): Promise<AdminOrder[]> {
    const data = await fetchData();
    return data.orders;
  },

  async saveOrder(order: AdminOrder): Promise<void> {
    const data = await fetchData();
    if (!data.orders.find(o => o.orderId === order.orderId && o.productName === order.productName)) {
      data.orders.push(order);
      await pushData(data);
    }
  },

  async getSellers(): Promise<AdminSeller[]> {
    const data = await fetchData();
    return data.sellers;
  },

  async saveSeller(seller: AdminSeller): Promise<void> {
    const data = await fetchData();
    data.sellers.push(seller);
    await pushData(data);
  },

  async getTotalRevenue(): Promise<number> {
    const orders = await AdminStorage.getOrders();
    return orders.reduce((s, o) => s + o.price * o.quantity, 0);
  },
};
