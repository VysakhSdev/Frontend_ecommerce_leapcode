import React, { useState, useEffect, useCallback } from 'react';
import { Users, ShoppingBag, Eye, Loader2, Trash2, Edit, PlusCircle, Inbox } from 'lucide-react';
import { adminAPI, authAPI, cartAPI, productAPI } from '../api/allApi.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ProductForm from '../components/ProductForm.jsx';
import CreateAdminForm from '../components/CreateAdminForm.jsx';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);


  console.log("Products carts:", carts);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // NEW: Prevents double submission
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUserRoleFormOpen, setIsUserRoleFormOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes, cartsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        productAPI.getAllProducts(),
        cartAPI.getAllCarts()
      ]);

      setUsers(usersRes?.data?.data || []);
      // Consistent check for nested data property
      setProducts(productsRes.data?.data || productsRes.data || []);
      setCarts(cartsRes.data?.data || []);
    } catch (err) {
      console.error('Dashboard sync error:', err);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---

  const handleSaveProduct = async (productData) => {
    if (submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...');
    
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully', { id: loadingToast });
      } else {
        await productAPI.createProduct(productData);
        toast.success('Product created successfully', { id: loadingToast });
      }
      
      setIsFormOpen(false);
      await fetchData(); // Refresh list after success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product', { id: loadingToast });
    } finally {
      setSubmitting(false); // 2. Re-enable button
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await productAPI.deleteProduct(productId);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleCreateAdmin = async (adminData) => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      await authAPI.createAdmin(adminData);
      toast.success('Admin created successfully!');
      setIsUserRoleFormOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 w-full">
      <Inbox className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );

  if (loading && users.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-gray-500 animate-pulse font-medium">Synchronizing System Data...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Modals */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={submitting} // Pass down to disable modal buttons
        />
      )}
      {isUserRoleFormOpen && (
        <CreateAdminForm
          onSave={handleCreateAdmin}
          onCancel={() => setIsUserRoleFormOpen(false)}
          isSubmitting={submitting}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Control Panel</h1>
        <div className="flex gap-3">
          {activeTab === 'products' && (
            <button 
              disabled={submitting}
              onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> New Product
            </button>
          )}
          {activeTab === 'users' && (
            <button 
              disabled={submitting}
              onClick={() => setIsUserRoleFormOpen(true)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all flex items-center shadow-lg shadow-purple-100 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> New Admin
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mb-8 border border-gray-200">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'carts', label: 'Live Carts', icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeTab === 'users' && (
        users.length > 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User Identity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState message="No users found in the system." />
      )}

      {activeTab === 'products' && (
        products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (

              console.log("Product item:", p),
              <div key={p.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden border">
  <img
    src={p?.imageUrl || 'https://placehold.co/50x50'}
    alt={p?.name}
    className="w-full h-full object-cover"
  />
</div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600 font-black">${Number(p.price).toFixed(2)}</span>
                  <span className={`font-medium ${p.stock < 10 ? 'text-orange-500' : 'text-gray-400'}`}>Stock: {p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState message="Inventory is currently empty." />
      )}

     {activeTab === 'carts' && (
  carts.length > 0 ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Group items by userId first */}
      {Object.values(
        carts.reduce((acc, currentItem) => {
          const uid = currentItem.userId;
          if (!acc[uid]) {
            acc[uid] = {
              userName: currentItem.User?.name || currentItem.User?.email || 'User',
              userEmail: currentItem.User?.email,
              userRole: currentItem.User?.role,
              items: [],
              grandTotal: 0
            };
          }
          acc[uid].items.push(currentItem);
          acc[uid].grandTotal += Number(currentItem.Product?.price || 0) * currentItem.quantity;
          return acc;
        }, {})
      ).map((groupedCart, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h4 className="font-bold text-gray-900">{groupedCart.userName}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-black">{groupedCart.userRole}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-indigo-600">${groupedCart.grandTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {groupedCart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm items-center">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">{item.Product?.name}</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">x{item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900">
                  ${(Number(item.Product?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : <EmptyState message="No active carts." />
)}
    </div>
  );
};

export default SuperAdminDashboard;