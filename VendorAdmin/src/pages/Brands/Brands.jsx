import React, { useRef, useState } from "react";
import LoadingUI from "../../components/Loading";
import { FetchData } from "../../utils/FetchFromApi";

const Brands = ({ startLoading, stopLoading }) => {
  const formRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({
    id: "",
    name: "",
    description: "",
    products: 0,
    logo: null,
  });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewBrand({ ...newBrand, [name]: files ? files[0] : value });
  };

  // Handle form submission
  // const handleAddBrand = (e) => {
  //   e.preventDefault();
  //   if (!newBrand.name || !newBrand.description) {
  //     alert("Please fill out all required fields.");
  //     return;
  //   }

  //   // Add or edit brand
  //   const updatedBrands = newBrand.id
  //     ? brands.map((brand) =>
  //         brand.id === newBrand.id
  //           ? { ...newBrand, products: brand.products }
  //           : brand
  //       )
  //     : [...brands, { ...newBrand, id: String(Date.now()) }];
  //   setBrands(updatedBrands);

  //   // Reset the form
  //   setNewBrand({ id: "", name: "", description: "", products: 0, logo: null });
  //   setShowForm(false);
  // };

  const addBrand = async () => {
    const formData = new FormData.current();
    try {
      startLoading();
      const response = await FetchData(
        "brands/vendor/add-brand-request",
        "post",
        formData,
        true
      );
      console.log(response);
      alert(
        "Your Brand is sent for approval... It might take time to get reviewed"
      );
    } catch (error) {
      alert("error");
      console.log("Error getting all main subcategories", error);
    } finally {
      stopLoading();
    }
  };

  // Handle editing a brand
  const handleEditBrand = (brand) => {
    setNewBrand(brand);
    setShowForm(true);
  };

  // Handle deleting a brand
  const handleDeleteBrand = (id) => {
    const filteredBrands = brands.filter((brand) => brand.id !== id);
    setBrands(filteredBrands);
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    const filteredBrands = brands.filter(
      (brand) => !selectedBrands.includes(brand.id)
    );
    setBrands(filteredBrands);
    setSelectedBrands([]);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    const sortedBrands = [...brands].sort((a, b) =>
      e.target.value === "name"
        ? a.name.localeCompare(b.name)
        : b.products - a.products
    );
    setBrands(sortedBrands);
  };

  // Handle filtering
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Brands</h2>

      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row w-full justify-evenly items-center mb-4 gap-4 lg:gap-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded lg:w-1/3 w-full"
        />
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="border px-3 py-2 rounded w-full lg:w-1/3 "
        >
          <option value="name">Sort by Name</option>
          <option value="products">Sort by Products</option>
        </select>
      </div>

      {/* Add Brand Button */}
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Brand"}
        </button>
        {selectedBrands.length > 0 && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded ml-4 hover:bg-red-700"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Add/Edit Brand Form */}
      {showForm && (
        <form
          ref={formRef}
          onSubmit={addBrand}
          className="bg-gray-100 p-4 rounded mb-6 shadow"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Brand Name</label>
            <input
              type="text"
              name="name"
              // value={newBrand.name}
              // onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              // value={newBrand.description}
              // onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Brand Logo</label>
            <input
              type="file"
              name="logo"
              // onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
            {newBrand.logo && (
              <img
                src={URL.createObjectURL(newBrand.logo)}
                alt="Preview"
                className="mt-2 h-20"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {newBrand.id ? "Update Brand" : "Add Brand"}
          </button>
        </form>
      )}

      {/* Brand Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
              <th className="py-3 px-4 border-b">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedBrands(
                      e.target.checked ? brands.map((brand) => brand.id) : []
                    )
                  }
                />
              </th>
              <th className="py-3 px-4 border-b">Brand Name</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Products</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr
                key={brand.id}
                className="text-sm text-gray-700 border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={(e) =>
                      setSelectedBrands((prev) =>
                        e.target.checked
                          ? [...prev, brand.id]
                          : prev.filter((id) => id !== brand.id)
                      )
                    }
                  />
                </td>
                <td className="py-3 px-4 font-semibold">{brand.name}</td>
                <td className="py-3 px-4">{brand.description}</td>
                <td className="py-3 px-4 text-center">{brand.products}</td>
                <td className="py-3 px-4">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEditBrand(brand)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
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

export default LoadingUI(Brands);
