import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, ShoppingCart, Package, User, Calendar } from 'lucide-react';
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

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    ProductStorage.loadProducts().then((products) => {
      const foundProduct = products.find((p: Product) => p.id === Number(id));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/buyer');
      }
    });
  }, [id, navigate]);

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/buyer"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Marketplace
        </Link>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square lg:aspect-auto bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600?text=Product+Image';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {product.materialType}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.productName}
              </h1>

              <p className="text-3xl font-bold text-gray-900 mb-6">
                ₹{product.price}
              </p>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-5 h-5" />
                    <span>Seller: {product.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Package className="w-5 h-5" />
                    <span>Material: {product.materialType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Listed: {new Date(product.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/checkout/${product.id}`)}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </button>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Sustainable Choice</h3>
                <p className="text-sm text-green-700">
                  By purchasing this upcycled product, you're contributing to reducing textile waste
                  and supporting sustainable fashion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-sm text-gray-600">
              Made from recycled and upcycled materials
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="font-semibold mb-2">Unique Design</h3>
            <p className="text-sm text-gray-600">
              Each piece is one-of-a-kind
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="font-semibold mb-2">Support Local</h3>
            <p className="text-sm text-gray-600">
              Support independent creators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
