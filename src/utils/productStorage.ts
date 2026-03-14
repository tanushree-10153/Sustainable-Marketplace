const JSONBIN_BIN_ID = '69b5b8feb7ec241ddc6b2a9d';
const JSONBIN_API_KEY = '$2a$10$tIUS7NyS.wbotnCjR01Hx.K7jE/tSDOGRszMTLyVFHaMUCQKVq/OS';
const BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
};

export const ProductStorage = {
  // Load products from JSONBin (primary) with localStorage fallback
  loadProducts: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/latest`, { headers });
      const data = await res.json();
      const products = data.record?.products || [];
      // Cache locally
      localStorage.setItem('products', JSON.stringify(products));
      return products;
    } catch {
      // Fallback to localStorage if offline
      return JSON.parse(localStorage.getItem('products') || '[]');
    }
  },

  // Save products to JSONBin (primary) + localStorage cache
  saveProducts: async (products: any[]): Promise<boolean> => {
    try {
      await fetch(BASE_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ products }),
      });
      localStorage.setItem('products', JSON.stringify(products));
      return true;
    } catch {
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
