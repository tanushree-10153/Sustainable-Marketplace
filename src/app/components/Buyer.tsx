import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductStorage } from '../../utils/productStorage';

interface Product {
  id: number;
  sellerName: string;
  sellerEmail: string;
  materialType: string;
  productName: string;
  description: string;
  imageUrl: string;
  price: number;
  uploadDate: string;
}

export const Buyer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');

  useEffect(() => {
    const storedProducts = ProductStorage.loadProducts();
    setProducts(storedProducts);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMaterial === '' || product.materialType === filterMaterial;
    return matchesSearch && matchesFilter;
  });

  const materialTypes = Array.from(new Set(products.map((p) => p.materialType)));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover unique sustainable products from our community of creators
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="Search products..."
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none"
              >
                <option value="">All Materials</option>
                {materialTypes.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'Be the first to upload a product!'
                : 'Try adjusting your search or filter'}
            </p>
            {products.length === 0 && (
              <Link
                to="/seller"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Upload a Product
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400?text=Product+Image';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{product.materialType}</p>
                        <h3 className="font-semibold mb-2 text-gray-900 line-clamp-1">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold">₹{product.price}</p>
                          <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
