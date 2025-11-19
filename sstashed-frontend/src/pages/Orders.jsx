import { useEffect, useState } from 'react';
import { orderAPI } from '../api/axios';
import { formatCurrency, formatDateTime } from '../utils/auth';
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
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

  const getStatusIcon = (status) => {
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

  const getStatusColor = (status) => {
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
            <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <a
              href="/products"
              className="inline-block bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent">
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
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">
                      {order.items?.length || 0} Item(s)
                    </span>
                    {expandedOrder === order.id ? (
                      <FiChevronUp className="text-gray-600" size={20} />
                    ) : (
                      <FiChevronDown className="text-gray-600" size={20} />
                    )}
                  </button>

                  {expandedOrder === order.id && order.items && (
                    <div className="px-6 pb-6 space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
                            <h4 className="font-semibold text-gray-800">{item.productName}</h4>
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
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
                  {order.status === 'PENDING' || order.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  ) : null}
                  
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors"
                  >
                    View Details
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;