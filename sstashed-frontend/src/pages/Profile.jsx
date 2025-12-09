import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../api/axios';
import { toast } from 'react-hot-toast';
import { FiUser, FiMapPin, FiEdit2, FiTrash2, FiPlus, FiMail, FiPhone } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [addressForm, setAddressForm] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
      setProfileForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await profileAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.update(profileForm);
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addAddress(addressForm);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      resetAddressForm();
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateAddress(editingAddress, addressForm);
      toast.success('Address updated successfully!');
      setEditingAddress(null);
      resetAddressForm();
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await profileAPI.deleteAddress(addressId);
      toast.success('Address deleted successfully!');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const startEditingAddress = (address) => {
    setEditingAddress(address.id);
    setAddressForm({
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setShowAddressForm(false);
  };

  const resetAddressForm = () => {
    setAddressForm({
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      addressType: 'HOME',
      isDefault: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <FiUser />
                  <span>Profile Details</span>
                </h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="rounded-full p-2 hover:bg-gray-200 transition-colors duration-300"
                  >
                    <FiEdit2 />
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{profile?.role?.toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-3">
                      <FiMail className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-semibold">{profile?.email}</p>
                      </div>
                    </div>

                    {profile?.phone && (
                      <div className="flex items-center space-x-3">
                        <FiPhone className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="font-semibold">{profile?.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <FiMapPin className="text-primary" />
                  <span>Saved Addresses</span>
                </h2>
                <button
                  onClick={() => {
                    setShowAddressForm(!showAddressForm);
                    setEditingAddress(null);
                    resetAddressForm();
                  }}
                  className="flex items-center space-x-2 text-primary hover:text-secondary font-semibold"
                >
                  <FiPlus />
                  <span>Add New</span>
                </button>
              </div>

              {/* Add/Edit Address Form */}
              {(showAddressForm || editingAddress) && (
                <form
                  onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                  className="mb-6 p-4 bg-gray-50 border border-gray-400 rounded-lg"
                >
                  <h3 className="font-semibold mb-4">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                    />
                    <select
                      value={addressForm.addressType}
                      onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                      className={`px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent
                      ${addressForm.addressType=='' ? 'text-gray-500' : 'text-black'} `}
                    >
                      <option value="" disabled hidden>Select Address Type</option>
                      <option value="HOME" className='text-black'>Home</option>
                      <option value="WORK" className='text-black'>Work</option>
                      <option value="OTHER" className='text-black'>Other</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="rounded text-primary focus:ring-blue-500 focus:outline-none"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {editingAddress ? 'Update' : 'Save'} Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                        resetAddressForm();
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    No addresses saved. Add one to get started!
                  </p>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border border-black rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-bold text-primary">{address.addressType}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-1">{address.streetAddress}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} - {address.postalCode}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingAddress(address)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;