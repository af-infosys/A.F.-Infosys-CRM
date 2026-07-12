// src/pages/IncomeCategories.jsx
import React, { useState, useEffect, useCallback } from "react";
import { IncomeCategoryService } from "../services/incomeCategory.service";
import IncomeCategoryModal from "../components/IncomeCategoryModal";

export default function IncomeCategories() {
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ACTIVE"); // ACTIVE, INACTIVE, ALL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await IncomeCategoryService.getCategories(filterStatus);
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData, id) => {
    if (id) {
      await IncomeCategoryService.updateCategory(id, categoryData);
    } else {
      await IncomeCategoryService.createCategory(categoryData);
    }
    fetchCategories(); // Refresh list after save
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await IncomeCategoryService.toggleStatus(id, currentStatus);
      fetchCategories(); // Refresh list to reflect changes based on current filter
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Income Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your income classification labels.
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
              <option value="ALL">All Categories</option>
            </select>
            <button
              onClick={() => handleOpenModal()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded bg-red-50 p-4 text-sm text-red-600">
              Error loading categories: {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-gray-500">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <span className="text-gray-500">No categories found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="text-left text-sm text-gray-600"
                style={{ maxWidth: "fit-content" }}
              >
                <thead className="border-b bg-gray-50 text-xs text-gray-700 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Color</th>
                    <th className="px-4 py-3 font-medium">Icon</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div
                          className="h-6 w-6 rounded border border-gray-200"
                          style={{ backgroundColor: category.color }}
                          title={category.color}
                        ></div>
                      </td>
                      <td className="px-4 py-3 text-lg">{category.icon}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                            category.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="mr-3 font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(category._id, category.status)
                          }
                          className={`font-medium ${
                            category.status === "ACTIVE"
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {category.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <IncomeCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
