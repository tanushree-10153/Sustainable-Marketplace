// Vendor Chat Storage — persists all session data to localStorage

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  materialType: string;
}

export interface Order {
  orderId: string;
  transactionId: string;
  vendorEmail: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  placedAt: string;
  status: 'confirmed';
}

export interface SessionEvent {
  type: 'message' | 'product_view' | 'cart_add' | 'cart_remove' | 'order_placed';
  timestamp: string;
  data: any;
}

export interface VendorSession {
  vendorEmail: string;
  sessionId: string;
  startedAt: string;
  events: SessionEvent[];
  cart: CartItem[];
  orders: Order[];
}

const key = (email: string) => `vendor_session_${email}`;

export const VendorChatStorage = {
  getSession(email: string): VendorSession {
    try {
      const raw = localStorage.getItem(key(email));
      if (raw) return JSON.parse(raw);
    } catch {}
    const session: VendorSession = {
      vendorEmail: email,
      sessionId: `sess_${Date.now()}`,
      startedAt: new Date().toISOString(),
      events: [],
      cart: [],
      orders: [],
    };
    localStorage.setItem(key(email), JSON.stringify(session));
    return session;
  },

  save(session: VendorSession) {
    localStorage.setItem(key(session.vendorEmail), JSON.stringify(session));
  },

  log(email: string, type: SessionEvent['type'], data: any) {
    const session = VendorChatStorage.getSession(email);
    session.events.push({ type, timestamp: new Date().toISOString(), data });
    VendorChatStorage.save(session);
  },

  getCart(email: string): CartItem[] {
    return VendorChatStorage.getSession(email).cart;
  },

  setCart(email: string, cart: CartItem[]) {
    const session = VendorChatStorage.getSession(email);
    session.cart = cart;
    VendorChatStorage.save(session);
  },

  addToCart(email: string, item: CartItem) {
    const session = VendorChatStorage.getSession(email);
    const existing = session.cart.find(c => c.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      session.cart.push(item);
    }
    session.events.push({ type: 'cart_add', timestamp: new Date().toISOString(), data: item });
    VendorChatStorage.save(session);
  },

  removeFromCart(email: string, productName: string): boolean {
    const session = VendorChatStorage.getSession(email);
    const before = session.cart.length;
    session.cart = session.cart.filter(
      c => !c.productName.toLowerCase().includes(productName.toLowerCase())
    );
    if (session.cart.length < before) {
      session.events.push({ type: 'cart_remove', timestamp: new Date().toISOString(), data: { productName } });
      VendorChatStorage.save(session);
      return true;
    }
    return false;
  },

  updateQuantity(email: string, productName: string, qty: number): boolean {
    const session = VendorChatStorage.getSession(email);
    const item = session.cart.find(c => c.productName.toLowerCase().includes(productName.toLowerCase()));
    if (item) { item.quantity = qty; VendorChatStorage.save(session); return true; }
    return false;
  },

  clearCart(email: string) {
    const session = VendorChatStorage.getSession(email);
    session.cart = [];
    VendorChatStorage.save(session);
  },

  placeOrder(email: string, deliveryAddress: string): Order | null {
    const session = VendorChatStorage.getSession(email);
    if (session.cart.length === 0) return null;
    const order: Order = {
      orderId: `ORD-${Date.now()}`,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      vendorEmail: email,
      items: [...session.cart],
      total: session.cart.reduce((s, i) => s + i.price * i.quantity, 0),
      deliveryAddress,
      placedAt: new Date().toISOString(),
      status: 'confirmed',
    };
    session.orders.push(order);
    session.cart = [];
    session.events.push({ type: 'order_placed', timestamp: new Date().toISOString(), data: order });
    VendorChatStorage.save(session);
    return order;
  },

  getOrders(email: string): Order[] {
    return VendorChatStorage.getSession(email).orders;
  },

  getTotalSpent(email: string): number {
    return VendorChatStorage.getOrders(email).reduce((s, o) => s + o.total, 0);
  },

  getBrowsedToday(email: string): string[] {
    const session = VendorChatStorage.getSession(email);
    const today = new Date().toDateString();
    return session.events
      .filter(e => e.type === 'product_view' && new Date(e.timestamp).toDateString() === today)
      .map(e => e.data?.productName)
      .filter(Boolean);
  },
};
