import { useParams } from "react-router";
import ProductCard from "../../Components/ProductCard";
import { useEffect, useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";

const AllProducts = () => {
  const allproducts = [
    {
      ProductName: "just another product",
      CurrentPrice: 500,
      Mrp: 1000,
      Rating: "4.5",
      off: "50% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 800,
      Mrp: 1200,
      Rating: "4.0",
      off: "33% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
  ];

  const [products, setProducts] = useState();
  const [error, setError] = useState(null);
  const { category, subcategory } = useParams();
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

  const fetchProducts = async () => {
    try {
      const response = await FetchData(
        `products/get-all-product/${category}/${subcategory}`,
        // `products/get-all-product`,
        "get"
      );
      // console.log("response");
      console.log(response);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
    // console.log("response");
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col flex-wrap justify-center gap-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">
          {category}:{" "}
          <span className="text-xl font-medium ml-20">{subcategory}</span>
        </h1>
        {/* <h1 className="text-3xl">{subcategory}</h1> */}
      </div>
      <div className="flex flex-wrap justify-start items-center gap-6 p-4">
        {products?.map((product, index) => (
          <ProductCard
            key={index}
            ProductName={product?.name}
            CurrentPrice={product?.price}
            Mrp={product?.price}
            Rating={product?.Rating}
            Offer={product?.off}
            Description={product?.description}
            productId={product?._id}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
