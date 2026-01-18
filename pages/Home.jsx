import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart, Search, PackageSearch } from 'lucide-react';
import { productAPI } from '../api/allApi.jsx';
import toast from 'react-hot-toast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getAllProducts();
        const data = response.data?.data || response.data || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products', err);
        toast.error("Connecting to server...");

      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || categoryMatch;
    });
  }, [products, searchTerm]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("Item is out of stock!");
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Gallery</h1>
          {!loading && <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} items found</p>}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white shadow-sm transition-all sm:text-sm"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 border border-gray-50"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (

            console.log(product),
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-md font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{product.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-indigo-600">${Number(product.price).toFixed(2)}</span>
                  </div>

                  {isAuthenticated && user?.role === 'user' ? (
                    <button
                      disabled={product.stock <= 0}
                      onClick={() => handleAddToCart(product)}
                      className={`p-2.5 rounded-xl transition-all ${product.stock <= 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95'
                        }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  ) : !isAuthenticated && (
                    <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded font-bold italic uppercase tracking-tighter">Login to Buy</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <PackageSearch className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No products found</h2>
          <p className="text-gray-500 max-w-xs text-center mt-2">
            We couldn't find any products matching ..
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-6 text-indigo-600 font-bold hover:underline"
          >
            Clear search results
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;