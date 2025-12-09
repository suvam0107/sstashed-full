import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { FiShoppingCart } from 'react-icons/fi';

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  const handleUpdateQuantity = async (itemId, quantity) => {
    await updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="text-gray-600 text-lg ml-2">Loading your cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex text-center items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-6 relative inline-block">
            <FiShoppingCart fill='currentColor' size={80} className="text-emerald-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiShoppingCart size={64} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="inline-block text-gray-800 hover:text-emerald-400 hover:underline transition-colors duration-300"
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
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;