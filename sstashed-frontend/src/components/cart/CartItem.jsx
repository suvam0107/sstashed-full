import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { formatCurrency } from '../../utils/auth';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-200 rounded shrink-0">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">🏺</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrease}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <FiMinus size={16} />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <FiPlus size={16} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-bold text-lg text-primary">{formatCurrency(subtotal)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;