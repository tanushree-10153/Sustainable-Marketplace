import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Upload, Image as ImageIcon, Package } from 'lucide-react';
import { ProductStorage } from '../../utils/productStorage';
import { sendEmail } from '../../utils/emailService';

export const Seller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState(user?.name || '');
  const [sellerEmail, setSellerEmail] = useState(user?.email || '');
  const [materialType, setMaterialType] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerName || !sellerEmail || !materialType || !productName || !description || !price || !imageFile) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const products = ProductStorage.loadProducts();
      const newProduct = {
        id: Date.now(),
        sellerName,
        sellerEmail,
        materialType,
        productName,
        description,
        imageUrl: imagePreview,
        price: parseFloat(price),
        uploadDate: new Date().toISOString(),
      };

      products.push(newProduct);
      const saveSuccess = ProductStorage.saveProducts(products);

      if (!saveSuccess) {
        alert('Error saving product. Please try again.');
        return;
      }

      // Verify the product was saved
      const savedProducts = ProductStorage.loadProducts();
      const productExists = savedProducts.some((p: any) => p.id === newProduct.id);

      if (!productExists) {
        alert('Error saving product. Please try again.');
        return;
      }

      sendEmail({
        user_name: sellerName,
        user_email: sellerEmail,
        subject: 'Product Listed Successfully',
        message: `Hi ${sellerName}, your product "${productName}" has been listed on the marketplace for ₹${price}. It is now visible to buyers.`,
      });

      if (user?.whatsapp) {
        sendWhatsApp(
          user.whatsapp,
          `🛍️ Hi ${sellerName}! Your product *"${productName}"* has been listed on UPCYCLE for ₹${price}. Buyers can now find it at https://sustainable-fashion-marketplace.netlify.app/buyer`
        );
      }

      alert(`Product uploaded successfully! Total products in marketplace: ${savedProducts.length}`);

      // Reset form
      setMaterialType('');
      setProductName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview('');

      // Redirect to buyer page to see the product
      setTimeout(() => navigate('/buyer'), 1000);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Your Product</h1>
            <p className="text-gray-600 mt-2">Share your upcycled creations with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Name
                </label>
                <input
                  id="sellerName"
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="sellerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="sellerEmail"
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-2">
                Material Type
              </label>
              <select
                id="materialType"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select material type</option>
                <option value="Recycled Denim">Recycled Denim</option>
                <option value="Recycled Cotton">Recycled Cotton</option>
                <option value="Upcycled Fabric">Upcycled Fabric</option>
                <option value="Mixed Recycled">Mixed Recycled</option>
                <option value="Vintage Material">Vintage Material</option>
                <option value="Recycled Polyester">Recycled Polyester</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Eco-friendly tote bag"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe your product, materials used, and unique features..."
                required
              />
            </div>

            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  required
                />
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <div className="aspect-square max-w-xs bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (INR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="h-5 w-5 text-gray-400 font-bold">₹</span>
                </div>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="2999"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
