const JSONBIN_BIN_ID = '69b5b8feb7ec241ddc6b2a9d';
const JSONBIN_API_KEY = '$2a$10$tIUS7NyS.wbotnCjR01Hx.K7jE/tSDOGRszMTLyVFHaMUCQKVq/OS';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Fetch products from JSONBin
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
      },
    });

    const data = await response.json();
    const products = data.record?.products || [];
    const count = products.length;

    // Build product summary
    let replyMessage = `🛍️ *UPCYCLE Marketplace Update*\n\n`;
    replyMessage += `📦 Total products listed: *${count}*\n\n`;

    if (count > 0) {
      replyMessage += `🔖 Recent listings:\n`;
      const recent = products.slice(-3).reverse();
      recent.forEach((p) => {
        replyMessage += `• ${p.productName} — ₹${p.price} (${p.materialType})\n`;
      });
      replyMessage += `\n🌐 Browse all: https://sustainable-fashion-marketplace.netlify.app/buyer`;
    } else {
      replyMessage += `No products listed yet. Be the first to sell!\n🌐 https://sustainable-fashion-marketplace.netlify.app/seller`;
    }

    // Respond with TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${replyMessage}</Message>
</Response>`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: twiml,
    };
  } catch (error) {
    console.error('Webhook error:', error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, could not fetch product data right now. Try again later.</Message>
</Response>`;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: twiml,
    };
  }
};
