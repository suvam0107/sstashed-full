import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import WishlistItem from '../components/wishlist/WishlistItem';
import WishlistSummary from '../components/wishlist/WishlistSummary';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [sortOrder, setSortOrder] = useState('newest');

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
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

  // Filter out any invalid wishlist items
  const validWishlist = wishlist.filter(item => item && item.product);

  // Sort wishlist items
  const sortedWishlist = [...validWishlist].sort((a, b) => {
    const dateA = new Date(a.addedAt || 0);
    const dateB = new Date(b.addedAt || 0);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (sortedWishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-6 relative inline-block">
            <FaHeart size={80} className="text-red-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaHeart size={64} className="text-red-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Save your favorite items to buy them later
          </p>
          <Link
            to="/products"
            className="inline-block text-gray-800 hover:text-red-400 hover:underline transition-colors duration-300"
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {sortedWishlist.length} {sortedWishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <FaHeart size={48} className="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedWishlist.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="lg:col-span-1">
            <WishlistSummary
              wishlist={sortedWishlist}
              onClearAll={handleClearWishlist}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

