import { FiClock, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';

// Status icons and colors helpers
export const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return <FiClock className="text-yellow-500" size={20} />;
    case 'CONFIRMED':
    case 'PROCESSING':
      return <FiPackage className="text-blue-500" size={20} />;
    case 'SHIPPED':
      return <FiTruck className="text-purple-500" size={20} />;
    case 'DELIVERED':
      return <FiCheck className="text-green-500" size={20} />;
    case 'CANCELLED':
      return <FiX className="text-red-500" size={20} />;
    default:
      return <FiClock className="text-gray-500" size={20} />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Payment method display names
export const getPaymentMethodName = (method) => {
  switch (method) {
    case 'COD':
      return 'Cash on Delivery';
    case 'CARD':
      return 'Credit/Debit Card';
    case 'UPI':
      return 'UPI Payment';
    case 'NET_BANKING':
      return 'Net Banking';
    default:
      return method;
  }
};
