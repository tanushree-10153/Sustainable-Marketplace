import { useEffect, useState, useRef } from 'react';
import { ProductStorage } from '../../utils/productStorage';

const WHATSAPP_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface Message {
  from: 'bot' | 'user';
  text: string;
}

const getBotReply = (input: string, productCount: number, products: any[]): string => {
  const msg = input.toLowerCase().trim();

  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return `👋 Hello! Welcome to *UPCYCLE* Vendor Support.\n\nI can help you with:\n1️⃣ Product count\n2️⃣ Recent listings\n3️⃣ How to sell\n4️⃣ Contact support\n\nType a number or ask me anything!`;
  }
  if (msg === '1' || msg.includes('how many') || msg.includes('product count') || msg.includes('total')) {
    return `📦 There are currently *${productCount} products* listed on UPCYCLE marketplace.`;
  }
  if (msg === '2' || msg.includes('recent') || msg.includes('latest') || msg.includes('new product')) {
    if (products.length === 0) return `😔 No products listed yet. Be the first to sell!`;
    const recent = products.slice(-3).reverse();
    let reply = `🆕 *Recent Listings:*\n\n`;
    recent.forEach((p: any) => {
      reply += `• *${p.productName}* — ₹${p.price}\n  ${p.materialType} by ${p.sellerName}\n\n`;
    });
    return reply.trim();
  }
  if (msg === '3' || msg.includes('how to sell') || msg.includes('sell') || msg.includes('list product')) {
    return `🛍️ *How to sell on UPCYCLE:*\n\n1. Register/Login on the site\n2. Go to the Sell page\n3. Fill in product details & upload image\n4. Submit — your product goes live instantly!\n\n🌐 Visit: https://sustainable-fashion-marketplace.netlify.app/seller`;
  }
  if (msg === '4' || msg.includes('contact') || msg.includes('support') || msg.includes('help')) {
    return `📞 *Contact Support:*\n\nEmail: support@upcycle.com\nPhone: +91 89280 99523\n\nWe're available Mon–Sat, 9am–6pm.`;
  }
  if (msg.includes('price') || msg.includes('cost')) {
    return `💰 Product prices vary by seller. Browse all listings at:\nhttps://sustainable-fashion-marketplace.netlify.app/buyer`;
  }

  return `🤖 I didn't quite get that. Try asking:\n\n• "How many products are listed?"\n• "Show recent listings"\n• "How to sell?"\n• "Contact support"`;
};

export const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ProductStorage.loadProducts().then((p) => {
      setProducts(p);
      setProductCount(p.length);
    });
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        from: 'bot',
        text: `👋 Hello! Welcome to *UPCYCLE* Vendor Support.\n\nI can help you with:\n1️⃣ Product count\n2️⃣ Recent listings\n3️⃣ How to sell\n4️⃣ Contact support\n\nType a number or ask me anything!`,
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);

    setTimeout(() => {
      const reply = getBotReply(userMsg, productCount, products);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    }, 600);
  };

  const formatText = (text: string) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line.replace(/\*(.*?)\*/g, '$1').split(/\*([^*]+)\*/).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    ));

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-green-500 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500">
              {WHATSAPP_ICON}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">UPCYCLE Vendor Bot</p>
              <p className="text-green-100 text-xs">🟢 Online</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white text-xl leading-none">&times;</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#ece5dd]" style={{ maxHeight: '320px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                  msg.from === 'user'
                    ? 'bg-green-100 text-gray-800 rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Open Vendor Chat"
      >
        {WHATSAPP_ICON}
        <span className="text-sm font-semibold">Vendor Chat</span>
      </button>
    </>
  );
};
