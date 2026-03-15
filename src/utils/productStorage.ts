const JSONBIN_BIN_ID = '69b5b8feb7ec241ddc6b2a9d';
const JSONBIN_API_KEY = '$2a$10$UbEjsZRD45In5eY.rr0umuUOFBJOS34UGwK006UJDImW1Y7m4.Eim';
const BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
};

export const ProductStorage = {
  loadProducts: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/latest`, { headers });
      if (!res.ok) throw new Error('JSONBin fetch failed');
      const data = await res.json();
      const products = data?.record?.products;
      return Array.isArray(products) ? products : [];
    } catch {
      try {
        const local = JSON.parse(localStorage.getItem('products') || '[]');
        return Array.isArray(local) ? local : [];
      } catch {
        return [];
      }
    }
  },

  saveProducts: async (products: any[]): Promise<boolean> => {
    try {
      const safe = Array.isArray(products) ? products : [];
      const res = await fetch(BASE_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ products: safe }),
      });
      if (!res.ok) throw new Error('JSONBin save failed');
      localStorage.setItem('products', JSON.stringify(safe));
      return true;
    } catch (err) {
      console.error('saveProducts error:', err);
      return false;
    }
  },

  clearAllProducts: async () => {
    await ProductStorage.saveProducts([]);
    localStorage.removeItem('products');
  },

  getStorageInfo: async () => {
    const products = await ProductStorage.loadProducts();
    return { totalProducts: products.length };
  },
};
