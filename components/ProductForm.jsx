import React, { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.imageUrl || "");
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        stock: "",
        imageUrl: "",
      });
      setImagePreview("");
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "imageUrl") setImagePreview(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Title - Full Width */}
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Product Title
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                required
              />
            </div>

            {/* Price & Stock - Side by Side */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base resize-none"
                required
              />
            </div>

            <div className="col-span-2 flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Image URL
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    name="imageUrl"
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                  />
                </div>
              </div>
              <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 p-2.5 rounded-lg border border-indigo-200 transition-colors flex-shrink-0">
                <Upload size={20} className="text-indigo-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-12 h-12 object-cover rounded-lg border shadow-sm flex-shrink-0"
                  alt="Preview"
                /> // Increased preview size
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {product ? "Update Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
