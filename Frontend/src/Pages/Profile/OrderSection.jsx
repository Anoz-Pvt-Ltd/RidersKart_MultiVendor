import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";
import { Link } from "react-router";

const OrderSection = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/all-products-of/${user?.[0]?._id}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };
    fetchAllOrders();
  }, [user]);

  const ProductCard = ({
    ProductName,
    CurrentPrice,
    Image,
    productId,
    className,
    productLength,
  }) => {
    return (
      <Link
        to={`/current-order/${productId}`}
        className={`w-full lg:h-28 whiteSoftBG shadow-md hover:shadow-lg overflow-hidden rounded-lg hover:scale-105 duration-300 ease-in-out ${className}`}
      >
        <div>
          <div className="p-2 m-2 overflow-hidden object-center flex justify-center items-center">
            <div className="grid grid-cols-1 lg:gap-4 md:grid-cols-5 md:grid-rows-1">
              {/* Product Image */}
              <div className="w-full flex justify-center items-center">
                <img
                  src={Image}
                  alt="No Image found"
                  className="w-16 rounded-full"
                />
              </div>

              {/* Product Name */}
              <div className="flex justify-center items-center text-center md:text-left">
                <h1 className="text-lg font-semibold truncate">
                  {ProductName}
                </h1>
              </div>

              {/* Price */}
              <div className="flex justify-center items-center text-center md:justify-end">
                <h1 className="text-sm md:text-xl">₹{CurrentPrice}</h1>
              </div>

              {/* Rate and Review */}
              <div className="flex justify-center items-center text-center md:justify-end">
                <h1 className="text-blue-500">
                  ★ Rate and review the products
                </h1>
              </div>

              {/*Number of products*/}
              <div className="flex justify-center items-center text-center md:justify-end">
                <h1 className="text-blue-500">
                  Total products: {productLength}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="flex justify-start items-start lg:gap-5 gap-1 flex-wrap lg:p-5 ">
        {/* {console.log(allOrders)} */}
        {allOrders?.map((product, index) => (
          <ProductCard
            Image={product?.products[0]?.product?.images[0]?.url}
            key={index}
            ProductName={product?.products[0]?.product?.name}
            CurrentPrice={product?.totalAmount}
            productId={product?._id}
            productLength={product?.products?.length}
          />
        ))}
      </div>
    </section>
  );
};

export default LoadingUI(OrderSection);
