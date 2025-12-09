import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '../../utils/auth';

const WishlistItem = ({ item, onAddToCart, onRemove }) => {
  // Safety check for product
  if (!item || !item.product) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Recently added';
    }
  };

  const product = item.product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="relative h-64 bg-gray-200 overflow-hidden group">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
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

          {/* Quick View Overlay */}
          <div className="absolute hover:bg-black/50 inset-0 flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 hover:underline transition-opacity duration-300">
              View Details
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        {/* Category Badge */}
        {product.categoryName && (
          <span className="inline-block bg-gray-100 text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">
            {product.categoryName}
          </span>
        )}

        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors min-h-14">
            {product.name || 'Untitled Product'}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">
          {product.description || 'Handcrafted with love by skilled artisans'}
        </p>

        {/* Price */}
        <p className="text-2xl font-bold text-primary mb-3">
          {formatCurrency(product.price || 0)}
        </p>

        {/* Date Added */}
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-medium">Added:</span> {formatDate(item.addedAt)}
        </p>

        {/* Stock Status */}
        <p className="text-xs mb-4">
          {product.stockQuantity > 0 ? (
            <span className="text-green-600 font-semibold">✓ In Stock ({product.stockQuantity} available)</span>
          ) : (
            <span className="text-red-600 font-semibold">✗ Out of Stock</span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stockQuantity === 0}
            className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 shadow-md hover:shadow-lg"
            title={product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <FiShoppingCart size={18} />
            <span className="text-sm">Add to Cart</span>
          </button>

          <button
            onClick={() => onRemove(product.id)}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200 hover:border-red-300"
            title="Remove from wishlist"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
