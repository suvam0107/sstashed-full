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
      <div className="flex items-center space-x-4">
        <div className="flex items-center border-2 border-gray-300 rounded-lg">
          <button
            onClick={handleDecrease}
            disabled={item.quantity == 1}
            className="p-2 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiMinus />
          </button>
          <span className="px-4 py-2 font-bold text-md border-x-2 border-gray-300">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={item.quantity >= item.product.stockQuantity}
            className="p-2 hover:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiPlus />
          </button>
        </div>
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