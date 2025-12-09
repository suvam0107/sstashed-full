import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const response = await wishlistAPI.getAll();
      // Filter out any invalid items with null products
      const validItems = (response.data || []).filter(item => item && item.product);
      setWishlist(validItems);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching wishlist:', error);
      }
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      await wishlistAPI.add(productId);
      await fetchWishlist();
      toast.success('Item added to wishlist');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add to wishlist';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      await fetchWishlist();
      toast.success('Item removed from wishlist');
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to remove from wishlist';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const normalizeId = (value) => {
    if (value === undefined || value === null) return null;
    return String(value);
  };

  const isInWishlist = (productId) => {
    const targetId = normalizeId(productId);
    if (targetId === null) return false;

    return wishlist.some((item) => {
      if (!item || !item.product) return false;

      const wishlistProductId = normalizeId(item.product.id);
      if (wishlistProductId !== null) {
        return wishlistProductId === targetId;
      }

      const wishlistItemId = normalizeId(item.id);
      return wishlistItemId === targetId;
    });
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistAPI.clear();
      await fetchWishlist();
      toast.success('Wishlist cleared');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast.error('Failed to clear wishlist');
      return { success: false };
    }
  };

  const value = {
    wishlist,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};