const JSONBIN_BIN_ID = '69b5b8feb7ec241ddc6b2a9d';
const JSONBIN_API_KEY = '$2a$10$UbEjsZRD45In5eY.rr0umuUOFBJOS34UGwK006UJDImW1Y7m4.Eim';
const BASE_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
};

// Images are stored in localStorage separately (base64 can be large)
const saveImage = (id: number, imageUrl: string) => {
  try {
    localStorage.setItem(`product_image_${id}`, imageUrl);
  } catch {}
};

const loadImage = (id: number): string => {
  return localStorage.getItem(`product_image_${id}`) || '';
};

// Strip imageUrl before saving to JSONBin, restore when loading
export const ProductStorage = {
  loadProducts: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/latest`, { headers });
      if (!res.ok) throw new Error('JSONBin fetch failed');
      const data = await res.json();
      const products = data?.record?.products;
      const result = Array.isArray(products) ? products : [];
      // Restore images from localStorage
      const withImages = result.map((p: any) => ({
        ...p,
        imageUrl: loadImage(p.id) || p.imageUrl || '',
      }));
      return withImages;
    } catch {
      try {
        const local = JSON.parse(localStorage.getItem('products_meta') || '[]');
        return Array.isArray(local)
          ? local.map((p: any) => ({ ...p, imageUrl: loadImage(p.id) || '' }))
          : [];
      } catch {
        return [];
      }
    }
  },

  saveProducts: async (products: any[]): Promise<boolean> => {
    try {
      const safe = Array.isArray(products) ? products : [];
      // Save images to localStorage, strip from JSONBin payload
      const metaOnly = safe.map((p: any) => {
        if (p.imageUrl) saveImage(p.id, p.imageUrl);
        const { imageUrl, ...meta } = p;
        return meta;
      });

      const res = await fetch(BASE_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ products: metaOnly }),
      });

      if (!res.ok) throw new Error('JSONBin save failed');
      localStorage.setItem('products_meta', JSON.stringify(metaOnly));
      return true;
    } catch (err) {
      console.error('saveProducts error:', err);
      return false;
    }
  },

  clearAllProducts: async () => {
    await ProductStorage.saveProducts([]);
    localStorage.removeItem('products_meta');
  },

  getStorageInfo: async () => {
    const products = await ProductStorage.loadProducts();
    return { totalProducts: products.length };
  },
};
