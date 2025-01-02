import React from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Button from "../../Components/Button";
import ProductCard from "../../Components/ProductCard";
import { useRef } from "react";

const CurrentProduct = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState();
  const [AllProducts, setAllProducts] = useState();

  useEffect(() => {
    async function getCurrentProduct(productId) {
      const Product = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      console.log(Product);
      setProducts(Product?.data?.data);
      return Product;
    }

    getCurrentProduct(productId);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await FetchData("products/get-all-product", "get");
      console.log(response);
      if (response.data.success) {
        setAllProducts(response.data.data);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sliderRef = useRef(null);

  // Function to scroll the products left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll the products right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start p-4">
        <section>
          <img
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/fk-cp-zion/2023/11_11/xmas/pc-banner/pc-banner-1.png" // Replace with the actual image URL
            alt={products?.name}
            className="bg-neutral-200 h-96 w-96 mx-20"
          />
          <div className="flex gap-52 justify-center items-center mt-20 ">
            <Button label={"Buy Now"} />
            <Button label={"Add to Cart"} className={`hover:bg-orange-500`} />
          </div>
        </section>
        <div className="flex-1 px-40 py-20">
          <h3 className="text-2xl font-semibold mb-2">{products?.name}</h3>
          <p className="text-gray-600 mb-4">{products?.description}</p>
          <div className="flex items-center mb-4">
            <span className="text-lg font-semibold mr-2">4.3</span>
            <span className="text-gray-500">4,486 Ratings & 494 Reviews</span>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold mr-4">{products?.price}</span>
            <span className="text-gray-500 line-through mr-4">₹14,600</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded-sm">
              40% off
            </span>
          </div>
          <h4 className="text-lg font-semibold mb-2">Available offers</h4>
          <ul className="list-disc list-inside">
            <li>
              Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
              T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,000 on HDFC Bank Pixel Credit Card EMI
              on 3 months tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,500 on HDFC Bank Pixel Credit Card EMI
              on 6m and 9m tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Special Price Get extra 20% off (price inclusive of
              cashback/coupon) T&C
            </li>
          </ul>
          <div className="flex gap-52 justify-center items-center mt-20 ">
            <Button label={"Buy Now"} />
            <Button label={"Add to Cart"} className={`hover:bg-orange-500`} />
          </div>
        </div>
      </div>
      <section>
        <h1 className="text-2xl font-semibold mb-2 ml-10">
          People Also visited
        </h1>
      </section>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          ←
        </button>

        <div
          className="flex overflow-x-scroll justify-start items-center gap-6 py-10 px-10"
          ref={sliderRef}
        >
          {AllProducts?.map((product, index) => (
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

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default CurrentProduct;
