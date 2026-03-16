import { useEffect, useState, useRef } from "react";
import { ProductStorage } from "../../utils/productStorage";
import { useAuth } from "../context/AuthContext";
import { VendorChatStorage } from "../../utils/vendorChatStorage";

const CHATBOT_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H4a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7.5 14a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 7.5 17 1.5 1.5 0 0 0 9 15.5 1.5 1.5 0 0 0 7.5 14m9 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 16.5 14M4 21v-2a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2H4z"/>
  </svg>
);

interface Message { from: "bot" | "user"; text: string; }
type AuthView = "gate" | "login" | "register";
type BotState = "menu" | "browsing" | "after_add" | "cart_view" | "awaiting_address" | "done";

const MAIN_MENU = "👋 Welcome to *UPCYCLE Vendor Bot*!\n\nChoose an option:\n\n1️⃣  Browse & Buy Products\n2️⃣  View My Cart\n3️⃣  My Order History\n\nReply with a number.";

export const WhatsAppButton = () => {
  const { isAuthenticated, login, register, user } = useAuth();
  const email = (user as any)?.email || "";

  const [open, setOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("gate");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [botState, setBotState] = useState<BotState>("menu");
  const [listedProducts, setListedProducts] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regError, setRegError] = useState("");

  useEffect(() => { ProductStorage.loadProducts().then(setProducts); }, []);

  useEffect(() => {
    if (open && isAuthenticated && messages.length === 0) pushBot(MAIN_MENU);
  }, [open, isAuthenticated]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const pushBot = (text: string) => setMessages(prev => [...prev, { from: "bot", text }]);

  const goMenu = () => { setBotState("menu"); setListedProducts([]); pushBot(MAIN_MENU); };

  const showProductList = () => {
    if (!products.length) { pushBot("😔 No products listed yet.\n\nReply *0* for main menu."); return; }
    const list = products.map((p, i) => `${i + 1}. *${p.productName}* — ₹${p.price}\n    🧵 ${p.materialType}`).join("\n\n");
    setListedProducts(products);
    setBotState("browsing");
    pushBot(`🛍️ *Available Products (${products.length}):*\n\n${list}\n\nReply with a *number* to add to cart.\nReply *0* to go back.`);
  };

  const showCart = () => {
    const cart = VendorChatStorage.getCart(email);
    if (!cart.length) { pushBot("🛒 Your cart is empty.\n\nReply *1* to browse or *0* for main menu."); setBotState("menu"); return; }
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const lines = cart.map((item, idx) => `${idx + 1}. *${item.productName}* x${item.quantity} — ₹${item.price * item.quantity}`).join("\n");
    setBotState("cart_view");
    pushBot(`🛒 *Your Cart:*\n\n${lines}\n\n💰 *Total: ₹${total}*\n\n1️⃣  Proceed to Checkout\n2️⃣  Clear Cart\n0️⃣  Main Menu`);
  };

  const showOrderHistory = () => {
    const orders = VendorChatStorage.getOrders(email);
    if (!orders.length) { pushBot("📦 No orders yet.\n\nReply *0* for main menu."); return; }
    const spent = VendorChatStorage.getTotalSpent(email);
    const lines = orders.map(o => `🧾 *${o.orderId}*\n   ₹${o.total} | ${new Date(o.placedAt).toLocaleDateString()}\n   ${o.items.length} item(s)`).join("\n\n");
    pushBot(`📦 *Your Orders:*\n\n${lines}\n\n💸 Total spent: *₹${spent}*\n\nReply *0* for main menu.`);
  };

  const processPayment = (address: string) => {
    pushBot("⏳ *Payment Processing...*\n\nPlease wait...");
    setTimeout(() => {
      const order = VendorChatStorage.placeOrder(email, address);
      if (order) {
        setBotState("done");
        pushBot(`✅ *Order Confirmed!*\n\n🧾 Order ID: *${order.orderId}*\n💳 Transaction ID: *${order.transactionId}*\n📍 Deliver to: ${order.deliveryAddress}\n💰 Total Paid: ₹${order.total}\n\nThank you for shopping on UPCYCLE! 🌿\n\nReply *0* for main menu.`);
      } else {
        pushBot("❌ Something went wrong. Please try again.\n\nReply *0* for main menu.");
        setBotState("menu");
      }
    }, 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const raw = input.trim();
    const msg = raw.toLowerCase().trim();
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: raw }]);
    VendorChatStorage.log(email, "message", { text: raw });

    setTimeout(() => {
      if (msg === "0" || msg === "menu" || msg === "back") { goMenu(); return; }
      switch (botState) {
        case "menu":
        case "done":
          if (msg === "1") showProductList();
          else if (msg === "2") showCart();
          else if (msg === "3") showOrderHistory();
          else pushBot("Please reply *1*, *2*, or *3*.");
          break;
        case "browsing": {
          const idx = parseInt(msg) - 1;
          if (!isNaN(idx) && idx >= 0 && idx < listedProducts.length) {
            const p = listedProducts[idx];
            VendorChatStorage.addToCart(email, { productId: p.id || p.productName, productName: p.productName, price: p.price, quantity: 1, materialType: p.materialType });
            VendorChatStorage.log(email, "product_view", { productName: p.productName });
            setBotState("after_add");
            pushBot(`✅ *${p.productName}* added to cart!\n💰 ₹${p.price} | 🧵 ${p.materialType}\n\nWhat next?\n\n1️⃣  Add more products\n2️⃣  View cart & checkout\n0️⃣  Main menu`);
          } else {
            pushBot(`⚠️ Please reply with a number between 1 and ${listedProducts.length}.`);
          }
          break;
        }
        case "after_add":
          if (msg === "1") showProductList();
          else if (msg === "2") showCart();
          else pushBot("Reply *1* to add more, *2* to view cart, or *0* for main menu.");
          break;
        case "cart_view":
          if (msg === "1") {
            const cart = VendorChatStorage.getCart(email);
            if (!cart.length) { pushBot("🛒 Cart is empty."); goMenu(); return; }
            const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const summary = cart.map(i => `• ${i.productName} x${i.quantity} — ₹${i.price * i.quantity}`).join("\n");
            setBotState("awaiting_address");
            pushBot(`📋 *Order Summary:*\n\n${summary}\n\n💰 *Total: ₹${total}*\n\n📍 Please type your *delivery address*:`);
          } else if (msg === "2") {
            VendorChatStorage.clearCart(email);
            pushBot("🗑️ Cart cleared.\n\nReply *0* for main menu.");
            setBotState("menu");
          } else {
            pushBot("Reply *1* to checkout, *2* to clear cart, or *0* for main menu.");
          }
          break;
        case "awaiting_address":
          pushBot(`📍 Address noted: *${raw}*`);
          processPayment(raw);
          break;
      }
    }, 400);
  };

  const handleLogin = () => {
    setLoginError("");
    if (!login(loginEmail, loginPassword)) { setLoginError("Invalid email or password."); return; }
    setLoginEmail(""); setLoginPassword("");
  };

  const handleRegister = () => {
    setRegError("");
    if (!regName || !regEmail || !regPassword || !regWhatsapp) { setRegError("All fields are required."); return; }
    if (!register(regName, regEmail, regPassword, regWhatsapp)) { setRegError("Email already registered."); return; }
    setRegName(""); setRegEmail(""); setRegPassword(""); setRegWhatsapp("");
    setAuthView("login");
  };

  const formatText = (text: string) =>
    text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*([^*]+)\*/).map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        <br />
      </span>
    ));

  const ic = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400";
  const bp = "w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors";
  const bs = "w-full border border-green-500 text-green-600 hover:bg-green-50 text-sm font-semibold py-2 rounded-lg transition-colors";

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-green-500 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500">{CHATBOT_ICON}</div>
            <div>
              <p className="text-white font-semibold text-sm">UPCYCLE Vendor Bot</p>
              <p className="text-green-100 text-xs">🟢 Online</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white text-xl leading-none">&times;</button>
          </div>

          {!isAuthenticated && authView === "gate" && (
            <div className="p-5 flex flex-col gap-3 text-center">
              <div className="text-4xl">🤖</div>
              <p className="text-gray-700 text-sm font-medium">Login or register to use Vendor Chat</p>
              <button className={bp} onClick={() => setAuthView("login")}>Login</button>
              <button className={bs} onClick={() => setAuthView("register")}>Register</button>
            </div>
          )}

          {!isAuthenticated && authView === "login" && (
            <div className="p-5 flex flex-col gap-3">
              <p className="text-gray-800 text-sm font-semibold text-center">Login to continue</p>
              <input className={ic} type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              <input className={ic} type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
              <button className={bp} onClick={handleLogin}>Login</button>
              <p className="text-xs text-center text-gray-500">No account? <button className="text-green-600 font-medium hover:underline" onClick={() => { setAuthView("register"); setLoginError(""); }}>Register</button></p>
            </div>
          )}

          {!isAuthenticated && authView === "register" && (
            <div className="p-5 flex flex-col gap-3">
              <p className="text-gray-800 text-sm font-semibold text-center">Create an account</p>
              <input className={ic} type="text" placeholder="Full Name" value={regName} onChange={e => setRegName(e.target.value)} />
              <input className={ic} type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              <input className={ic} type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
              <input className={ic} type="tel" placeholder="WhatsApp Number" value={regWhatsapp} onChange={e => setRegWhatsapp(e.target.value)} />
              {regError && <p className="text-red-500 text-xs">{regError}</p>}
              <button className={bp} onClick={handleRegister}>Register</button>
              <p className="text-xs text-center text-gray-500">Already have an account? <button className="text-green-600 font-medium hover:underline" onClick={() => { setAuthView("login"); setRegError(""); }}>Login</button></p>
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#ece5dd]" style={{ maxHeight: "340px" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm ${msg.from === "user" ? "bg-green-100 text-gray-800 rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                      {formatText(msg.text)}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="flex items-center gap-2 p-3 border-t bg-white">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={botState === "awaiting_address" ? "Enter delivery address..." : "Type a number..."}
                  className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400" />
                <button onClick={handleSend} className="bg-green-500 hover:bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button onClick={() => { if (open) { setOpen(false); } else { setOpen(true); if (!isAuthenticated) setAuthView("gate"); } }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Open Vendor Chat">
        {CHATBOT_ICON}
        <span className="text-sm font-semibold">Vendor Chat</span>
      </button>
    </>
  );
};
