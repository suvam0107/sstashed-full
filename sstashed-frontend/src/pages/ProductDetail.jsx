import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/auth';
import { FiShoppingCart, FiArrowLeft, FiHeart, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    await toggleWishlist(product.id);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (product.stockQuantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available`);
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      toast.success(`${quantity} item(s) added to cart!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (isAuthenticated) {
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <div className="bg-gray-100 rounded-xl h-96 lg:h-[500px] mb-4 overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">🏺</span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Wishlist */}
              <div className="flex justify-between items-start mb-4">
                {product.categoryName && (
                  <span className="inline-block bg-gray-100 text-black text-sm font-semibold px-3 py-1 rounded-full">
                    {product.categoryName}
                  </span>
                )}
                <button
                  className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                    inWishlist 
                      ? 'bg-red-50 scale-110' 
                      : 'bg-white hover:bg-red-50'
                  }`}
                  onClick={handleWishlistToggle}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {inWishlist ? (
                    <FaHeart size={24} className="text-red-500" />
                  ) : (
                    <FiHeart size={24} className="text-red-500" />
                  )}
                </button>
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl md:text-5xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'Handcrafted with love by skilled rural artisans.'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-semibold">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="font-semibold text-gray-700 mb-2 block">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-950 transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-6 py-2 font-bold text-lg border-x-2 border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stockQuantity}
                      className="px-4 py-2 hover:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-950 transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center space-x-4 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold text-sm md:text-lg transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 shadow-lg"
                >
                  <FiShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center space-x-4 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold text-sm md:text-lg transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500 shadow-lg"
                >
                  <FiCreditCard size={20} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid md:place-items-center grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <FiTruck className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On all orders</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiShield className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% protected</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiRefreshCw className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">7 days return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;