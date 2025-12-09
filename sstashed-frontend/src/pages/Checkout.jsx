import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { profileAPI, orderAPI } from '../api/axios';
import { formatCurrency } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck, FiPlus } from 'react-icons/fi';
import { getPaymentMethodName } from './../utils/helpers.jsx';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: '',
    isDefault: false,
  });

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await profileAPI.getAddresses();
      setAddresses(response.data);
      
      // Auto-select default address
      const defaultAddr = response.data.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      } else if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addAddress(newAddress);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      fetchAddresses();
      setNewAddress({
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        addressType: 'HOME',
        isDefault: false,
      });
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      const response = await orderAPI.create({
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
      });

      if (response.data) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <FiMapPin />
                  <span>Delivery Address</span>
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center space-x-2 text-black hover:text-gray-600 font-semibold text-sm"
                >
                  <FiPlus />
                  <span> Add Address </span>
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 border-2 border-gray-500 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <select
                      value={newAddress.addressType}
                      required
                      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                      className={`px-2 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${newAddress.addressType=='' ? 'text-gray-500' : 'text-black'} `}
                    >
                      <option value="" disabled hidden>Select Address Type</option>
                      <option value="HOME" className='text-black'>Home</option>
                      <option value="WORK" className='text-black'>Work</option>
                      <option value="OTHER" className='text-black'>Other</option>
                    </select>
                    <div className="flex space-x-4 justify-center">
                      <button
                        type="submit"
                        className="bg-emerald-100 text-emerald-500 px-6 py-2 rounded-lg hover:bg-emerald-200 transition-colors"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="bg-red-100 text-red-500 px-6 py-2 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No addresses found. Please add a delivery address.
                  </p>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-black bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">{address.addressType}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">
                            {address.streetAddress}, {address.city}
                          </p>
                          <p className="text-gray-600">
                            {address.state} - {address.postalCode}
                          </p>
                        </div>
                        {selectedAddress === address.id && (
                          <FiCheck className="text-emerald-500" size={24} />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold flex items-center space-x-2 mb-6">
                <FiCreditCard className="text-black" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {['COD', 'CARD', 'UPI', 'NET_BANKING'].map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method
                        ? 'border-black bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === method
                            ? 'border-emerald-500'
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {paymentMethod === method && (
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="font-semibold">
                          {getPaymentMethodName(method)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          🏺
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-6 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-black text-2xl">
                    {formatCurrency(cart.total)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full bg-red-500 border-2 border-transparent text-white hover:bg-transparent hover:border-red-500 hover:text-red-500  font-bold py-4 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;