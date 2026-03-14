// Utility functions for product data persistence
export const ProductStorage = {
  // Save products to localStorage with backup
  saveProducts: (products: any[]) => {
    try {
      const dataToSave = {
        products,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };

      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('products_backup', JSON.stringify(dataToSave));

      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  },

  // Load products from localStorage with fallback to backup
  loadProducts: () => {
    try {
      // Try to load main products data
      let products = JSON.parse(localStorage.getItem('products') || '[]');

      // If no products, try to load from backup
      if (products.length === 0) {
        const backupData = JSON.parse(localStorage.getItem('products_backup') || '{}');
        if (backupData.products && Array.isArray(backupData.products)) {
          products = backupData.products;
          console.log('Loaded products from backup');
        }
      }

      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  },

  // Clear all product data (for testing/debugging)
  clearAllProducts: () => {
    localStorage.removeItem('products');
    localStorage.removeItem('products_backup');
  },

  // Get storage info
  getStorageInfo: () => {
    const products = ProductStorage.loadProducts();
    const backupData = JSON.parse(localStorage.getItem('products_backup') || '{}');

    return {
      totalProducts: products.length,
      lastBackup: backupData.lastUpdated || null,
      storageUsed: JSON.stringify(products).length
    };
  }
};