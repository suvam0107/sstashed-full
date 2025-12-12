import { useEffect, useState } from 'react';
import { orderAPI } from '../api/axios';
import { formatCurrency, formatDateTime } from '../utils/auth';
import { FiPackage, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getStatusColor, getStatusIcon } from '../utils/helpers.jsx';
import { Link } from 'react-router-dom';

const BillModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bill Header */}
        <div className="bg-linear-to-r from-green-500 to-red-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">SStashed</h2>
              <p className="text-sm opacity-90">Order Invoice</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/50 rounded-full p-2 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Bill Body */}
        <div className="p-6">
          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{formatDateTime(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6 pb-6 border-b">
            <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
            <p className="font-semibold">
              {order.shippingAddress}, {order.shippingCity}<br />
              {order.shippingState} - {order.shippingPostalCode}<br />
              {order.shippingCountry}
            </p>
          </div>

          {/* Items Table */}
          <div className="mb-2">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 font-semibold text-sm text-center border-y">
                    <th className='p-2'>Product ID</th>
                    <th className='p-2'>Product Name</th>
                    <th className='p-2'>Quantity</th>
                    <th className='p-2'>Rate</th>
                    <th className='p-2'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item) => (
                    <tr key={item.id} className="text-sm text-center border-b">
                      <td className="p-3">{item.product?.id || 'N/A'}</td>
                      <td className="p-3 font-semibold">{item.productName}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{formatCurrency(item.price)}</td>
                      <td className="p-3 font-semibold">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (Included)</span>
                <span className="font-semibold">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-2xl text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              Thank you for shopping with SStashed!
            </p>
            <p className="text-xs text-gray-500 mt-2">
              For any queries, contact us at info@sstashed.com or +91 98310 58408
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll({
        page: pagination.page,
        size: pagination.size,
      });
      setOrders(response.data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div className="text-gray-600">
            Total Orders: <span className="font-semibold text-primary">{orders.length}</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-6 relative inline-block">
              <FiPackage fill='currentColor' size={80} className="text-amber-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FiPackage size={64} className="text-amber-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              to="/products"
              className="inline-block text-gray-800 hover:text-amber-400 hover:underline transition-colors duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-bold text-lg">{order.orderNumber}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end space-y-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(order.orderDate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment</p>
                      <p className="font-semibold">
                        {order.paymentMethod}
                        <span className={`ml-2 text-sm ${
                          order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          ({order.paymentStatus})
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                      <p className="text-sm font-semibold line-clamp-2">
                        {order.shippingAddress}, {order.shippingCity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items - Expandable */}
                <div className="border-t">
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="group w-full px-6 py-4 flex items-center justify-between"
                  >
                    <span className="font-semibold text-gray-700">
                      {order.items?.length || 0} Item(s)
                    </span>
                    {expandedOrder === order.id ? (
                      <FiChevronUp className="text-gray-600 group-hover:scale-120 transition-transform duration-300" size={20} />
                    ) : (
                      <FiChevronDown className="text-gray-600 group-hover:scale-120 transition-transform duration-300" size={20} />
                    )}
                  </button>

                  {expandedOrder === order.id && order.items && (
                    <div className="px-6 pb-6 space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
                          <div className="w-20 h-20 bg-gray-200 rounded shrink-0">
                            {item.product?.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.productName}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🏺
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <Link to={`/products/${item.product.id}`}>
                              <h4 className="font-semibold text-gray-800 hover:underline">{item.productName}</h4>
                            </Link>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 border-t flex justify-end space-x-4">
                  {order.status === 'PENDING' || order.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  ) : null}
                  
                  <button
                    onClick={() => setSelectedOrderForBill(order)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 0}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Bill Modal */}
            {selectedOrderForBill && (
              <BillModal 
                order={selectedOrderForBill} 
                onClose={() => setSelectedOrderForBill(null)} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;