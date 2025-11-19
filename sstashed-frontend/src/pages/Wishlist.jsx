import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/auth';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success){
      await removeFromWishlist(productId);
      toast.success('Product added to cart and removed from wishlist');
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiHeart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items to buy them later</p>
          <Link
            to="/products"
            className="inline-block bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <button
            onClick={handleClearWishlist}
            className="text-red-500 hover:text-red-700 font-semibold flex items-center space-x-2"
          >
            <FiTrash2 />
            <span>Clear All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <Link to={`/products/${item.product.id}`}>
                <div className="relative h-64 bg-gray-200">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-8xl">🏺</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/products/${item.product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary">
                    {item.product.name}
                  </h3>
                </Link>

                <p className="text-2xl font-bold text-primary mb-4">
                  {formatCurrency(item.product.price)}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={item.product.stockQuantity === 0}
                    className="flex-1 flex items-center justify-center space-x-2 bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                {item.product.stockQuantity === 0 && (
                  <p className="text-red-500 text-sm mt-2 text-center">Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;