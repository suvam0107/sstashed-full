import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0, itemCount: 0 });
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      // Only log error if it's not a 404 (which is expected when not logged in)
      if (error.response?.status !== 404) {
        console.error('Error fetching cart:', error);
      }
      // Set empty cart on error
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addItem({ productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add item to cart',
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, { quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update quantity',
      };
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to remove item',
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to clear cart',
      };
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};