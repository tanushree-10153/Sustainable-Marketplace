import { Recycle, Droplet, Shirt, TrendingDown, Users, Target, Heart } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold mb-4">About UPCYCLE</h1>
            <p className="text-xl max-w-2xl mx-auto text-green-100">
              Transforming the fashion industry one upcycled piece at a time
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to create a sustainable fashion ecosystem where old clothes get a second
            life as beautiful, unique lifestyle products. By connecting creators with conscious consumers,
            we're building a circular economy that benefits both people and the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Circular Economy</h3>
            <p className="text-gray-700">
              Transform waste into value through creative upcycling and sustainable design practices
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
            <p className="text-gray-700">
              Empower independent creators and connect them with conscious consumers worldwide
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Planet First</h3>
            <p className="text-gray-700">
              Every product sold reduces environmental impact and promotes sustainable living
            </p>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fashion industry is one of the world's largest polluters. We're here to change that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Shirt className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">92M</h3>
              <p className="text-gray-600">Tonnes of textile waste annually</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Droplet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2,700L</h3>
              <p className="text-gray-600">Water needed for one cotton shirt</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <TrendingDown className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10%</h3>
              <p className="text-gray-600">Of global carbon emissions from fashion</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Recycle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">&lt;1%</h3>
              <p className="text-gray-600">Of clothes are currently recycled</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1615485737442-7d6ab9f64db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwd2FzdGUlMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzczMDUyNTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Textile waste"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">What is Upcycling?</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Upcycling is the creative process of transforming old, discarded materials into new
                  products of higher quality or value. Unlike recycling, which breaks down materials,
                  upcycling preserves and enhances the original material's character.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every upcycled product saves water, reduces landfill waste, cuts carbon emissions,
                  and creates unique, one-of-a-kind items that tell a story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Benefits of Sustainable Fashion</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choosing upcycled products creates positive change
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Reduces Landfill Waste</h3>
              <p className="text-gray-600">
                Keep textiles out of landfills where they take decades to decompose and release
                harmful greenhouse gases.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Saves Water</h3>
              <p className="text-gray-600">
                Avoid the thousands of liters of water needed to produce new clothing from scratch.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Lowers Carbon Footprint</h3>
              <p className="text-gray-600">
                Reduce carbon emissions associated with manufacturing, transportation, and disposal
                of new products.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Supports Local Economy</h3>
              <p className="text-gray-600">
                Empower independent creators and small businesses in your community.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Unique Products</h3>
              <p className="text-gray-600">
                Own one-of-a-kind pieces that express your individual style and values.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shirt className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                Invest in well-crafted, durable products rather than fast fashion disposables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-gray-300 mb-8">
            Together, we can create a more sustainable future for fashion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/seller"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Start Selling
            </a>
            <a
              href="/buyer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Shop Sustainable
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
