import React, { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5'; 

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? All books in this category will also be deleted."
    );
    if (!confirmDelete) return;

    try {
      await deleteCategory(categoryId);
      toast.success('Category and its books deleted successfully');
      fetchCategories(); 
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    // Background: Lighter Dark Charcoal Gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col justify-center items-center p-6">
      
      {/* Central Container: Lighter Dark Card (Gray-800/95) with subtle border */}
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative border border-gray-600">
        
        {/* Back Button: Styled to match the card, using the original blue color */}
        <button
          onClick={() => navigate('/admin/dashboard')} 
          className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          {/* Note: IoArrowBack needs to be imported */}
          <IoArrowBack size={24} /> 
        </button>

        {/* Title: High-contrast white, larger, and bold */}
        <div className="text-center mb-10 mt-2">
          <h2 className="text-4xl font-extrabold text-white tracking-wider">BOOK CATEGORIES</h2>
        </div>
        
        {/* Table: Styled for dark theme with clear, legible data */}
        <table className="table-auto w-full text-left">
          {/* Table Head: Slightly lighter dark gray for clear heading separation */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tl-xl">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 font-semibold text-gray-200 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body: Zebra striping for easy reading on dark background */}
          <tbody>
            {categories.map((category, index) => (
              <tr 
                key={category.id} 
                // Alternating rows using different dark shades for "zebra" effect
                className={`transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'} hover:bg-gray-700`}
              >
                <td className="px-4 py-3 text-gray-400">{category.id}</td>
                <td className="px-4 py-3 font-medium text-white">{category.name}</td>
                <td className="px-4 py-3 text-gray-300">{category.description}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(category.id)}
                    // Delete button: ORIGINAL red color preserved
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CategoryList;
