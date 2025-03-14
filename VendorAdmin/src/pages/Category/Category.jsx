import React, { useEffect, useState } from "react";
import { categoryData as initialData } from "../../constants/VendorDashboard.Categories";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import LoadingUI from "../../components/Loading";

const Categories = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [categories, setCategories] = useState([]);
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
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  console.log(categories);

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
          "get"
        );
        // console.log(response);

        // Ensure categories exist before setting state
        setCategories(response.data?.data?.categories || []);
      } catch (error) {
        console.log("Error getting all main subcategories", error);
      } finally {
        stopLoading();
      }
    };

    getAllMainSubcategories();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        // console.log(response);
        if (response.data.success) setProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchProducts();
  }, [user]);

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
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Active categories
      </h2>

      {/* selling Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">Category ID</th>
              <th className="py-3 px-4 border-b">Category Name</th>
              <th className="py-3 px-4 border-b">Number of Products</th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((elements) => (
              <tr
                key={elements._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">{elements?.category?._id}</td>
                <td className="py-3 px-4 font-semibold">
                  {elements?.category?.title}
                </td>
                <td className="py-3 px-4 text-center">
                  {elements?.stockQuantity}
                </td>
                <td
                  className={`py-3 px-4 font-bold ${
                    elements.status === "Active"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {elements.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* all available category table */}
      <div className="overflow-x-auto my-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          All available categories
        </h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">Category ID</th>
              <th className="py-3 px-4 border-b">Category Name</th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">{category._id}</td>
                <td className="py-3 px-4 font-semibold">{category.title}</td>
                <td
                  className={`py-3 px-4 font-bold ${
                    category.status === "Active"
                      ? "text-green-600"
                      : "text-green-600"
                  }`}
                >
                  Active
                </td>
                {/* <td
                  className={`py-3 px-4 font-bold ${
                    category.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {category.status}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingUI(Categories);
