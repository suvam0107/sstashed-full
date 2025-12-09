import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { formatCurrency } from '../../utils/auth';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    await toggleWishlist(product.id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stockQuantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-linear-to-br from-gray-100 to-gray-200">
              <span className="text-8xl">🏺</span>
            </div>
          )}
          
          {/* Stock Badge */}
          {product.stockQuantity === 0 ? (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Out of Stock
            </div>
          ) : product.stockQuantity < 5 ? (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Only {product.stockQuantity} left!
            </div>
          ) : null}

          {/* Wishlist Button */}
          <button 
            className={`absolute top-3 left-3 z-10 p-2 rounded-full shadow-lg transition-all duration-300 ${
              inWishlist 
                ? 'bg-red-50 scale-110' 
                : 'bg-white opacity-0 group-hover:opacity-100 hover:bg-red-50'
            }`}
            onClick={handleWishlistToggle}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <FaHeart size={20} className="text-red-500" />
            ) : (
              <FiHeart size={20} className="text-red-500" />
            )}
          </button>


          {/* Quick View Overlay */}
          <div className="absolute group-hover:bg-black/50 inset-0 flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 hover:underline transition-opacity duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          {product.categoryName && (
            <span className="inline-block bg-gray-100 text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">
              {product.categoryName}
            </span>
          )}

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-14">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">
            {product.description || 'Handcrafted with love by skilled artisans'}
          </p>

          {/* Artisan Info */}
          {product.artisanName && (
            <p className="text-xs text-gray-500 mb-3">
              By: <span className="font-semibold">{product.artisanName}</span>
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600">✓ In Stock</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className='p-3 rounded-full transition-all duration-300 bg-blue-400 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:bg-blue-400 disabled:opacity-50 disabled:scale-100'
              title={product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <FiShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;