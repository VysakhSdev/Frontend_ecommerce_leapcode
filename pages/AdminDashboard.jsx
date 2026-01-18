import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Plus, Users, ShoppingBag, Eye, Inbox, X, Loader2 } from "lucide-react";
import { productAPI, adminAPI, cartAPI } from "../api/allApi.jsx";
import ProductForm from "../components/ProductForm.jsx";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  
  // Data States
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUserCart, setSelectedUserCart] = useState(null);

  console.log(selectedUserCart,"21312")

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Logic for Tabs
  const fetchData = async () => {
    try {
      if (activeTab === "products") {
        const res = await productAPI.getAllProducts();
        setProducts(res.data?.data || res.data || []);
      } else if (activeTab === "users") {
        const res = await adminAPI.getAllCustomers();
        setUsersList(res.data?.data || []);
      }
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}`, err);
      toast.error(`Failed to load ${activeTab}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // NEW: Optimized View Cart Logic (Fetch on click)
  const handleViewUserCart = async (targetUser) => {
    console.log(targetUser,"targetUser")
    setIsCartModalOpen(true);
    setCartLoading(true);
    setSelectedUserCart(null); // Reset previous data

    try {
      // API call triggered specifically for this user ID
      const res = await cartAPI.getCart(targetUser.id);


      console.log(res,"res")
      
      // Ensure we extract the CartItems correctly based on your backend structure
      const cartData = res.data?.data || res.data;
      setSelectedUserCart(cartData);
    } catch (err) {
      console.error("Failed to fetch user cart", err);
      toast.error("Could not retrieve cart details");
    } finally {
      setCartLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProduct) {
        await productAPI.updateProduct(selectedProduct.id, formData);
        toast.success("Product updated");
      } else {
        await productAPI.createProduct(formData);
        toast.success("Product created");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Save operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (user?.role !== "superadmin") return toast.error("Unauthorized action");
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await productAPI.deleteProduct(id);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 w-full">
      <Inbox className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users, inventory, and live carts.</p>
        </div>
        {activeTab === "products" && (
          <button
            onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mb-8 border border-gray-200">
        {[
          { id: "users", label: "Users", icon: Users },
          { id: "products", label: "Products", icon: ShoppingBag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab Content */}
      {activeTab === "users" && (
        usersList.length > 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User Identity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUserCart(u)}
                        className="inline-flex items-center text-indigo-600 font-bold text-sm hover:underline"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState message="No users found in the system." />
      )}

      {/* Products Tab Content */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Product Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Inventory</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src={p.imageUrl ? `http://localhost:5000${p.imageUrl}` : "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded-lg object-cover mr-3 border"
                      onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                    />
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">${Number(p.price).toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${p.stock < 10 ? "text-red-500" : "text-gray-500"}`}>
                    {p.stock} units
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }} className="text-indigo-600 font-bold text-xs hover:underline">Edit</button>
                    {user?.role === "superadmin" && (
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 font-bold text-xs hover:underline">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW CART MODAL - Fetches on Demand */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
              <div>
                <h3 className="text-xl font-bold">User's Live Cart</h3>
                <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Real-time sync</p>
              </div>
              <button onClick={() => setIsCartModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {cartLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">Fetching items...</p>
                </div>
              ) : (selectedUserCart || selectedUserCart).length > 0 ? (
                (selectedUserCart || selectedUserCart).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <img
                      src={item.Product?.imageUrl ? `http://localhost:5000${item.Product.imageUrl}` : "https://via.placeholder.com/40"}
                      className="w-14 h-14 rounded-xl object-cover border bg-white"
                      alt={item.Product?.name}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{item.Product?.name}</p>
                      <p className="text-xs text-gray-400 font-medium">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-black text-indigo-600">
                      ${(Number(item.Product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 font-medium">This cart is currently empty</p>
                </div>
              )}
            </div>
            {!cartLoading && (selectedUserCart?.CartItems || selectedUserCart?.items)?.length > 0 && (
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <span className="text-gray-500 font-bold text-sm uppercase">Total Value</span>
                    <span className="text-xl font-black text-indigo-600">
                        ${(selectedUserCart.CartItems || selectedUserCart.items).reduce((acc, item) => acc + (Number(item.Product?.price || 0) * item.quantity), 0).toFixed(2)}
                    </span>
                </div>
            )}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductForm
          product={selectedProduct}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;