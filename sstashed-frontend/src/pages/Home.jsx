import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../api/axios';
import ProductCard from '../components/products/ProductCard';
import { FiArrowRight, FiGlobe, FiStar, FiUsers } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll({ page: 0, size: 8 }),
        categoryAPI.getAll(),
      ]);
      
      setFeaturedProducts(productsRes.data.content);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-100 to-orange-100 text-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Discover Authentic Handcrafted Treasures
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Support rural artisans and bring home unique, handmade products
            crafted with love and tradition.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold border-2 border-white hover:border-2 hover:border-green-500 hover:text-green-500 transition-all duration-300"
          >
            <span>Shop Now</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-linear-to-b from-yellow-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          
          {loading ? (
            <div className="text-center">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="bg-white scale-90 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
                >
                  {/* Category Image */}
                  <div className="h-auto aspect-4/3 bg-gray-200 overflow-hidden rounded-lg">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏺
                      </div>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-800 group-hover:underline transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary hover:text-green-500 font-semibold flex items-center space-x-2 mr-2 transition-colors duration-300"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What is SStashed Section */}
      <section className="py-16 bg-linear-to-t from-purple-200 to-white text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What is SStashed?
          </h2>
          
          <div className="max-w-5xl mx-auto text-lg leading-relaxed md:flex md:items-center md:justify-between">
            <div className="md:order-2 md:w-2/5 flex justify-center">
              <img 
                src="../src/assets/logo.png" 
                alt="SStashed Logo" 
                className="w-48 h-48 md:w-64 md:h-64 mb-12 md:mb-0 md:hover:rotate-360 transition-transform duration-1000"
              />
            </div>
            <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0 md:pr-12">
              <p className="mb-6">
                At SStashed, we believe that talent is universal, but opportunity is not. Our platform is dedicated to unearthing the exquisite craftsmanship found in rural communities and giving it the global stage it deserves. 
              </p>
              <p className="mb-6">
                By cutting out the middlemen, we ensure fair livelihoods for our artisans and deliver high-quality, one-of-a-kind products directly to you. Every purchase preserves a culture and sustains a family.
              </p>
            </div>            
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 text-black bg-linear-to-b from-purple-200 to-blue-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiStar size={34} className='mx-auto text-amber-400'/>
              <h3 className="text-xl font-semibold mb-2">Authentic Craftsmanship</h3>
              <p className="text-accent">
                Every product is handmade by skilled artisans with years of experience
              </p>
            </div>
            
            <div className="text-center">
              <FiUsers size={34} className='mx-auto text-green-500'/>
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-accent">
                Direct support to artisans ensuring fair compensation for their work
              </p>
            </div>
            
            <div className="text-center">
              <FiGlobe size={34} className='mx-auto text-blue-400'/>
              <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
              <p className="text-accent">
                Eco-friendly products made with sustainable practices
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;