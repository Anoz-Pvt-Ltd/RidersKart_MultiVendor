import React, { useState } from "react";
import { categoryData as initialData } from "../../constants/VendorDashboard.Categories";

const Categories = () => {
  const [categories, setCategories] = useState(initialData);
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    description: "",
    parent: "",
    products: 0,
    status: "Active",
    image: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewCategory({ ...newCategory, [name]: files ? files[0] : value });
  };

  // Handle form submission
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.id || !newCategory.name || !newCategory.description) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    initialData.push(newCategory);

    setNewCategory({
      id: "",
      name: "",
      description: "",
      parent: "",
      products: 0,
      status: "Active",
      image: null,
    });
    setShowForm(false);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    const sorted = [...categories].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "products") return b.products - a.products;
      return 0;
    });
    setCategories(sorted);
  };

  // Handle bulk selection
  const toggleCategorySelection = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    const filteredCategories = categories.filter(
      (category) => !selectedCategories.includes(category.id)
    );
    setCategories(filteredCategories);
    setSelectedCategories([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Categories</h2>

      {/* Add Category Button */}
      <div className="mb-4 flex justify-between items-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>

        {/* Sorting */}
        <div>
          <label className="mr-2 text-gray-700">Sort By:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border rounded"
          >
            <option value="name">Name</option>
            <option value="products">Number of Products</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <form
          onSubmit={handleAddCategory}
          className="bg-gray-100 p-4 rounded mb-6 shadow"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Category ID</label>
              <input
                type="text"
                name="id"
                value={newCategory.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Category Name</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Parent Category</label>
              <select
                name="parent"
                value={newCategory.parent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Category Image</label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Category
          </button>
        </form>
      )}

      {/* Bulk Actions */}
      <div className="mb-4">
        {selectedCategories.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedCategories(
                      e.target.checked ? categories.map((cat) => cat.id) : []
                    )
                  }
                />
              </th>
              <th className="py-3 px-4 border-b">Category ID</th>
              <th className="py-3 px-4 border-b">Category Name</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Products</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategorySelection(category.id)}
                  />
                </td>
                <td className="py-3 px-4">{category.id}</td>
                <td className="py-3 px-4 font-semibold">{category.name}</td>
                <td className="py-3 px-4">{category.description}</td>
                <td className="py-3 px-4 text-center">{category.products}</td>
                <td
                  className={`py-3 px-4 font-bold ${
                    category.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {category.status}
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
