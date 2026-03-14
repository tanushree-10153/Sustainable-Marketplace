const JSONBIN_BIN_ID = '69b5b8feb7ec241ddc6b2a9d';
const JSONBIN_API_KEY = '$2a$10$tIUS7NyS.wbotnCjR01Hx.K7jE/tSDOGRszMTLyVFHaMUCQKVq/OS';

const syncToJSONBin = async (products: any[]) => {
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify({ products }),
    });
  } catch (error) {
    console.error('JSONBin sync error:', error);
  }
};

export const ProductStorage = {
  saveProducts: (products: any[]) => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('products_backup', JSON.stringify({
        products,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
      }));
      // Sync to JSONBin for WhatsApp bot
      syncToJSONBin(products);
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  },

  loadProducts: () => {
    try {
      let products = JSON.parse(localStorage.getItem('products') || '[]');
      if (products.length === 0) {
        const backupData = JSON.parse(localStorage.getItem('products_backup') || '{}');
        if (backupData.products && Array.isArray(backupData.products)) {
          products = backupData.products;
        }
      }
      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  },

  clearAllProducts: () => {
    localStorage.removeItem('products');
    localStorage.removeItem('products_backup');
  },

  getStorageInfo: () => {
    const products = ProductStorage.loadProducts();
    const backupData = JSON.parse(localStorage.getItem('products_backup') || '{}');
    return {
      totalProducts: products.length,
      lastBackup: backupData.lastUpdated || null,
      storageUsed: JSON.stringify(products).length,
    };
  },
};
