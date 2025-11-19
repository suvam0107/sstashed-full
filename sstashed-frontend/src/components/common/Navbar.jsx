import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-primary bg-gray-100'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <FiHome size={20} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/products"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/products')
                  ? 'text-primary bg-gray-100'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <FiGrid size={20} />
              <span className="font-medium">Products</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;