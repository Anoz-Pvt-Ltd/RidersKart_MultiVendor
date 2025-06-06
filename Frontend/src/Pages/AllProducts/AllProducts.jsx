import { useParams } from "react-router";
import ProductCard from "../../Components/ProductCard";
import { useEffect, useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";
import { useSelector } from "react-redux";

const AllProducts = ({ startLoading, stopLoading }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((store) => store.UserInfo.user);

  const { category, subcategory, category_title, subcategory_title } =
    useParams();

  const fetchProducts = async (page = 1) => {
    startLoading();
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        category: category || "",
        subcategory: subcategory || "",
        page,
        limit: 10,
        userAddress: user.length > 0 ? user.address.city : null,
      }).toString();

      const response = await FetchData(
        `products/get-all-products?${queryParams}`,
        "get"
      );
      // console.log(response);

      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(Math.ceil(response.data.data.total / 10));
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [category, subcategory, page]);
  console.log(products);

  return (
    <div className='flex flex-col flex-wrap justify-center gap-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold'>
          {category_title || "All Products"}{" "}
          {subcategory_title && (
            <span className='text-xl font-medium ml-4'>
              {" "}
              - {subcategory_title}
            </span>
          )}
        </h1>
      </div>

      <div className='flex flex-wrap justify-start items-center gap-6 p-4'>
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              Image={product?.images[0]?.url}
              key={product._id}
              ProductName={product.name}
              CurrentPrice={product.price.sellingPrice}
              Mrp={product.price.MRP}
              Rating={product.Rating}
              Offer={product.off}
              Description={product.description}
              productId={product._id}
              Discount={product.price.discount}
              Stock={product.stockQuantity}
            />
          ))
        ) : (
          <p className='text-center text-gray-500'>No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center mt-4'>
          <button
            className='px-4 py-2 bg-gray-300 rounded-md mr-2 disabled:opacity-50'
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className='text-lg font-medium'>
            {page} / {totalPages}
          </span>
          <button
            className='px-4 py-2 bg-gray-300 rounded-md ml-2 disabled:opacity-50'
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(AllProducts);

// console.log("response");
// console.log(category, subcategory);

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const response = await FetchData(
//         `products/get-all-product/${category}/${subcategory}`,
//         // `products/get-all-product`,
//         "get"
//       );
//       console.log("response");
//       console.log(response);
//       if (response.data.success) {
//         setProducts(response.data.data);
//       } else {
//         setError("Failed to load products.");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch products.");
//     }
//   };

//   fetchProducts();
// }, [category]);
