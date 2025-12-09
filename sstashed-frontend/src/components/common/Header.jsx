import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="text-black">
      {/* Header Banner */}
      <img src="../src/assets/banner.png" className="absolute top-0 left-0 -z-10 w-full h-auto" />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div>
              <span className="text-2xl font-bold text-green-500">SS</span>
              <span className="text-2xl font-bold text-red-500">tashed</span>
              <p className="text-xs text-accent">Handcrafted with Love ❤️</p>
            </div>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
              {/* Wishlist */}
              <Link
                  to="/wishlist"
                  className={`relative hover:text-rose-500 rounded-full p-2 hover:text-accent transition-colors ${
                    isActive('/wishlist') ? 'bg-rose-100 text-red-500' : ''
                  }`}
                  title="Wishlist"
                >
                  <FiHeart size={24} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className={`relative hover:text-blue-500 rounded-full p-2 transition-colors ${
                    isActive('/cart') ? 'bg-blue-100 text-blue-500' : ''
                  }`}
                  title="Cart"
                >
                  <FiShoppingCart size={24} />
                  {cart.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.itemCount}
                    </span>
                  )}
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  className={`hover:text-amber-500 rounded-full p-2 transition-colors ${
                    isActive('/orders') ? 'bg-amber-100 text-amber-500' : ''
                  }`}
                  title="Orders"
                >
                  <FiPackage size={24} />
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className={`hover:text-purple-500 rounded-full p-2 transition-colors ${
                    isActive('/profile') ? 'bg-purple-100 text-purple-500' : ''
                  }`}
                  title="Profile"
                >
                  <FiUser size={24} />
                </Link>

                {/* User Info & Logout */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm hidden md:block">
                    Hi, {user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-400 transition-colors"
                    title="Logout"
                  >
                    <FiLogOut size={24} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-transparent hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;