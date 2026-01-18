import React, { useState } from 'react';
import { X } from 'lucide-react';

const AdminModuleForm = ({ onSave, onCancel }) => {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ moduleName, description });
    setModuleName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Admin Module</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
              Module Name
            </label>
            <input
              type="text"
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., User Management, Product Analytics"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Briefly describe what this module does..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Save Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModuleForm;
