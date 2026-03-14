export const sendWhatsApp = async (to: string, message: string) => {
  try {
    await fetch('/.netlify/functions/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
  }
};
