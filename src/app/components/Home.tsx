import { Link } from 'react-router';
import { ArrowRight, Upload, ShoppingCart, Recycle, Droplet, Trash2, Shirt } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductStorage } from '../../utils/productStorage';

const featuredProducts = [
  {
    id: 1,
    name: 'Upcycled Denim Jacket',
    material: 'Recycled Denim',
    price: 45,
    image: 'https://images.unsplash.com/photo-1587374835402-bdfdeb2aa0c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGN5Y2xlZCUyMGRlbmltJTIwamFja2V0fGVufDF8fHx8MTc3MzE2NDYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Eco Tote Bag',
    material: 'Recycled Cotton',
    price: 25,
    image: 'https://images.unsplash.com/photo-1758708536099-9f46dc81fffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzczMDg3MDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Vintage Fabric Bag',
    material: 'Upcycled Fabric',
    price: 35,
    image: 'https://images.unsplash.com/photo-1615485737442-7d6ab9f64db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGZhYnJpYyUyMGJhZ3xlbnwxfHx8fDE3NzMxNjQ2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'Sustainable Outfit',
    material: 'Mixed Recycled',
    price: 55,
    image: 'https://images.unsplash.com/photo-1760533091973-1262bf57d244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmclMjBzdXN0YWluYWJsZXxlbnwxfHx8fDE3NzMwOTAzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1587761383903-4ed7d428e746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjB1cGN5Y2xlZCUyMGNsb3RoZXN8ZW58MXx8fHwxNzczMTY0NjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1573875133384-07fe039214a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZmFzaGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzMxNjQ2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1615485737442-7d6ab9f64db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwd2FzdGUlMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzczMDUyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1726491703591-8ec8a2b749f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MzA2NTUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export const Home = () => {
  const [uploadedProducts, setUploadedProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    clothesUpcycled: 0,
    waterSaved: 0,
    wasteReduced: 0,
  });

  useEffect(() => {
    // Load uploaded products from localStorage
    const storedProducts = ProductStorage.loadProducts();
    setUploadedProducts(storedProducts.slice(0, 4)); // Show latest 4 products

    // Calculate stats based on uploaded products
    const totalProducts = storedProducts.length;
    setStats({
      clothesUpcycled: totalProducts,
      waterSaved: totalProducts * 1000, // Rough estimate: 1000L water saved per product
      wasteReduced: totalProducts * 5, // Rough estimate: 5kg waste reduced per product
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        clothesUpcycled: Math.min(prev.clothesUpcycled + 50, 5420),
        waterSaved: Math.min(prev.waterSaved + 100, 12500),
        wasteReduced: Math.min(prev.wasteReduced + 30, 3200),
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1587761383903-4ed7d428e746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjB1cGN5Y2xlZCUyMGNsb3RoZXN8ZW58MXx8fHwxNzczMTY0NjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Sustainable Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Turn Old Clothes into Sustainable Lifestyle Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-gray-200"
            >
              Join the circular fashion revolution
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/seller"
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Upcycling <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/buyer"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center gap-2"
              >
                Explore Products <ShoppingCart className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Uploads</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest sustainable fashion items uploaded by our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {uploadedProducts.length > 0 ? (
            uploadedProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.materialType}</p>
                      <h3 className="font-semibold mb-2 text-gray-900">{product.productName}</h3>
                      <p className="text-lg font-bold">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Fallback to featured products if no uploaded products
            featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.material}</p>
                      <h3 className="font-semibold mb-2 text-gray-900">{product.name}</h3>
                      <p className="text-lg font-bold">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/buyer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            View All Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to join the sustainable fashion movement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Register</h3>
              <p className="text-gray-600">
                Create your account and join our community of sustainable creators
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Upload Products</h3>
              <p className="text-gray-600">
                Share your upcycled creations with detailed descriptions and photos
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Buy Sustainable</h3>
              <p className="text-gray-600">
                Discover and purchase unique sustainable products from our community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Together, we're making a difference for our planet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
            <Recycle className="w-12 h-12 mx-auto mb-4 text-green-700" />
            <div className="text-4xl font-bold text-green-700 mb-2">
              {stats.clothesUpcycled.toLocaleString()}+
            </div>
            <p className="text-gray-700 font-medium">Clothes Upcycled</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
            <Droplet className="w-12 h-12 mx-auto mb-4 text-blue-700" />
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {stats.waterSaved.toLocaleString()}L
            </div>
            <p className="text-gray-700 font-medium">Water Saved</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
            <Trash2 className="w-12 h-12 mx-auto mb-4 text-purple-700" />
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {stats.wasteReduced.toLocaleString()}kg
            </div>
            <p className="text-gray-700 font-medium">Waste Reduced</p>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our sustainable fashion journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators and buyers in the sustainable fashion movement
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Started Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
