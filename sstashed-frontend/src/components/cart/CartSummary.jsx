import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/auth';

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
          <span className="font-semibold">{formatCurrency(cart.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">FREE</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary text-2xl">
              {formatCurrency(cart.total)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={cart.itemCount === 0}
        className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Free shipping on all orders
      </p>
    </div>
  );
};

export default CartSummary;