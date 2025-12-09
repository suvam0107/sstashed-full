import { formatCurrency } from '../../utils/auth';

const WishlistSummary = ({ wishlist, onClearAll }) => {
  const totalValue = wishlist.reduce((sum, item) => {
    return sum + (item?.product?.price || 0);
  }, 0);
  
  const inStockCount = wishlist.filter(item => 
    item?.product?.stockQuantity > 0
  ).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Wishlist Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Items</span>
          <span className="font-bold text-xl text-primary">{wishlist.length}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">In Stock</span>
          <span className="font-semibold text-green-600">{inStockCount} items</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Out of Stock</span>
          <span className="font-semibold text-red-600">{wishlist.length - inStockCount} items</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Value</span>
            <span className="font-bold text-2xl text-primary">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        disabled={wishlist.length === 0}
        className="w-full bg-red-500 text-white border-2 border-transparent hover:bg-transparent hover:text-red-500 hover:border-red-500 font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        Clear All Items
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Save your favorite items for later
      </p>
    </div>
  );
};

export default WishlistSummary;