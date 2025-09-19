import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import LoadingUI from "../../Components/Loading";
import { Check } from "lucide-react";

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState("Active Products");
  // const [activeSection, setActiveSection] = useState(
  //   () => localStorage.getItem("activeSection") || "Active Products"
  // );

  // useEffect(() => {
  //   localStorage.setItem("activeSection", activeSection);
  // }, [activeSection]);

  const sections = [
    "Active Products",
    "Inactive Products",
    "Suspended Products",
  ];
  const tableHeadersProducts = [
    "Product ID",
    "Vendor",
    "Product Name",
    "Category ID",
    "Subcategory ID",
  ];
  const [allActiveProducts, setAllActiveProducts] = useState([]);
  const [allInactiveProducts, setAllInactiveProducts] = useState([]);
  const [allSuspendedProducts, setAllSuspendedProducts] = useState([]);

  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredInactive, setFilteredInactive] = useState([]);
  const [filteredSuspended, setFilteredSuspended] = useState([]);

  const [searchTermProduct, setSearchTermProduct] = useState("");

  const handleSearchProduct = (e) => {
    const searchValueProduct = e.target.value.toLowerCase();
    setSearchTermProduct(searchValueProduct);

    const filterFn = (products) =>
      products.filter(
        (product) =>
          product._id.toLowerCase().includes(searchValueProduct) ||
          product.vendor?.name?.toLowerCase().includes(searchValueProduct) ||
          product.name?.toLowerCase().includes(searchValueProduct)
      );

    if (activeSection === "Active Products") {
      setFilteredActive(
        searchValueProduct ? filterFn(allActiveProducts) : allActiveProducts
      );
    } else if (activeSection === "Inactive Products") {
      setFilteredInactive(
        searchValueProduct ? filterFn(allInactiveProducts) : allInactiveProducts
      );
    } else if (activeSection === "Suspended Products") {
      setFilteredSuspended(
        searchValueProduct
          ? filterFn(allSuspendedProducts)
          : allSuspendedProducts
      );
    }
  };

  // update filtered lists whenever data changes
  useEffect(() => {
    setFilteredActive(allActiveProducts);
  }, [allActiveProducts]);

  useEffect(() => {
    setFilteredInactive(allInactiveProducts);
  }, [allInactiveProducts]);

  useEffect(() => {
    setFilteredSuspended(allSuspendedProducts);
  }, [allSuspendedProducts]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "products/admin/get-all-products-admin",
            "get"
          );
          let products = response.data.data;

          const active = products.filter(
            (p) => !p.status || p.status === "active"
          );
          const inactive = products.filter((p) => p.status === "inactive");
          const suspended = products.filter((p) => p.status === "suspended");

          setAllActiveProducts(active);
          setAllInactiveProducts(inactive);
          setAllSuspendedProducts(suspended);
        } catch (err) {
          console.log(err);
          setError(err.response?.data?.message || "Failed to fetch products");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllProducts();
  }, [user]);

  const ProductTable = ({
    products,
    headers,
    onSearch,
    searchValue,
    placeholder,
  }) => {
    return (
      <div>
        {/* Search */}
        <InputBox
          Type="text"
          Value={searchValue}
          onChange={onSearch}
          Placeholder={placeholder}
        />

        {/* Table */}
        <div className="h-[70vh] overflow-x-scroll overflow-y-scroll">
          <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-500 px-4 py-2 bg-neutral-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products?.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className=" h-fit ">
                    {/* Product ID */}
                    <td className="border border-gray-500 px-4 py-2">
                      <Link
                        className="hover:text-blue-500 underline-blue-500 hover:underline"
                        to={`/current-product/${product._id}`}
                      >
                        {product._id}
                      </Link>
                    </td>

                    {/* Vendor Info */}
                    <td className="border border-gray-500 px-4 py-2">
                      <div className="flex flex-col justify-center items-center">
                        <h2>
                          <strong>Name: </strong>
                          {product.vendor?.name}
                        </h2>
                        <span className="text-gray-500 text-xs">
                          <strong>Contact Number: </strong>
                          {product.vendor?.contactNumber}
                        </span>
                        <span className="text-gray-500 text-xs">
                          <strong>ID: </strong>
                          {product.vendor?._id}
                        </span>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="border border-gray-500 px-4 py-2 w-96 overflow-hidden">
                      <div className="flex justify-between">
                        <div>
                          <h2>{product.name}</h2>
                          <div className="flex gap-1 justify-center items-center w-fit">
                            {product.brand?.logo?.url && (
                              <img
                                src={product.brand.logo.url}
                                alt=""
                                className="w-10 object-contain"
                              />
                            )}
                            <span className="text-gray-500 text-xs">
                              {product.brand?.title}
                            </span>
                          </div>
                        </div>
                        {product.images?.[0]?.url && (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="h-20 w-20 object-contain"
                          />
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="border border-gray-500 px-4 py-2">
                      <div className="flex flex-col justify-center items-center">
                        <h2>
                          <strong>Name: </strong>
                          {product.category?.title}
                        </h2>
                        <span className="text-gray-500 text-xs">
                          <strong>ID: </strong>
                          {product.category?._id}
                        </span>
                      </div>
                    </td>

                    {/* Subcategory */}
                    <td className="border border-gray-500 px-4 py-2">
                      <div className="flex flex-col justify-center items-center">
                        <h2>
                          <strong>Name: </strong>
                          {product.subcategory?.title}
                        </h2>
                        <span className="text-gray-500 text-xs">
                          <strong>ID: </strong>
                          {product.subcategory?._id}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <section className="flex justify-start items-center gap-5">
        {sections.map((section, idx) => (
          <li
            key={section}
            className={`cursor-pointer transition-all duration-300 color-purple rounded-xl shadow-2xl w-fit px-4 py-2 list-none hover:text-[#DF3F33] ${
              activeSection === section
                ? " list-none bg-[#DF3F33] text-white hover:text-white"
                : "bg-white text-black"
            }`}
            onClick={() => {
              setActiveSection(section);
            }}
          >
            <span className="flex items-center gap-2">
              {activeSection === section && (
                <span className="text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
              {section}
            </span>
          </li>
        ))}
      </section>
      <main className="">
        {activeSection === "Active Products" && (
          <ProductTable
            products={filteredActive}
            headers={tableHeadersProducts}
            onSearch={handleSearchProduct}
            searchValue={searchTermProduct}
            placeholder="Search by Product Name, Product ID, Vendor ID"
          />
        )}
        {activeSection === "Inactive Products" && (
          <ProductTable
            products={filteredInactive}
            headers={tableHeadersProducts}
            onSearch={handleSearchProduct}
            searchValue={searchTermProduct}
            placeholder="Search by Product Name, Product ID, Vendor ID"
          />
        )}
        {activeSection === "Suspended Products" && (
          <ProductTable
            products={filteredSuspended}
            headers={tableHeadersProducts}
            onSearch={handleSearchProduct}
            searchValue={searchTermProduct}
            placeholder="Search by Product Name, Product ID, Vendor ID"
          />
        )}
      </main>
    </section>
  );
};

export default LoadingUI(Products);
