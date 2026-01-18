import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, loading } = useCart();
  const subtotal = items.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleUpdateQty = (item, newQty) => {
    if (newQty > item.Product.stock) {
      toast.error(`Only ${item.Product.stock} units available in stock`);
      return;
    }
    updateQuantity(item.id, newQty);
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout... (Mock)");
  };

  if (loading && items.length === 0) {
    return <div className="text-center py-20 animate-spin"><ShoppingBag className="mx-auto" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-20 w-20 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <Link to="/" className="mt-4 inline-block text-indigo-600 font-medium">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        
        {/* Cart Items List */}
        <div className="lg:col-span-7 divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="flex py-6">
              <img src={item.Product.imageUrl} className="w-24 h-24 rounded-lg object-cover" alt="" />
              <div className="ml-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between font-bold text-gray-900">
                    <h3>{item.Product.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-indigo-600">${item.Product.price}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => handleUpdateQty(item, item.quantity - 1)} className="p-1 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item, item.quantity + 1)} className="p-1 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                  </div>
                  <span className="text-xs text-gray-400">Total: ${(item.Product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 mt-10 lg:mt-0 bg-gray-50 p-8 rounded-2xl h-fit border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-4"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold text-indigo-600">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all">
            Checkout <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;