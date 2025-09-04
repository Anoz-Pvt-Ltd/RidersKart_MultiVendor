import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { FetchData } from "../Utility/FetchFromApi";
import { addCart } from "../Utility/Slice/CartSlice";
import { ShoppingCart } from "lucide-react";
import { truncateNumber, truncateString } from "../Utility/Utility-functions";
import { useDispatch, useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
import LoadingUI from "./Loading";

const ProductCard = ({
  ProductName,
  CurrentPrice,
  Mrp,
  Rating,
  Offer,
  Description,
  Image,
  productId,
  className,
  Discount,
  Stock,
  startLoading,
  stopLoading,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.UserInfo.user[0]);
  const addProductToCart = async () => {
    try {
      startLoading();
      const currentProduct = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      const response = await FetchData(
        `users/${user?._id}/${productId}/cart/add`,
        "post"
      );
      alert(response.data.message);
      dispatch(addCart(currentProduct.data.data));
      // dispatch(addProductToCart(productId));
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Please Login first!, Failed to add product to cart."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <Link>
      {/* <Link to={`/current-product/${productId}`} className={`w-fit ${className}`}> */}
      <div className="whiteSoftBG shadow-md hover:shadow-lg h-auto w-52 overflow-hidden rounded-lg hover:scale-105 duration-300 ease-in-out">
        <div className="  overflow-hidden object-center flex justify-center items-center">
          <img
            src={Image}
            alt="No Image found"
            className="lg:w-64 lg:h-52 w-32 h-32 object-contain"
          />
        </div>
        <div className="h-1/3 px-2 py-3 flex flex-col">
          <h1 className=" font-semibold truncate">{ProductName}</h1>
          <div className="flex w-full justify-around items-center ">
            <h1 className="">₹{CurrentPrice}</h1>
            <h1 className=" line-through text-gray-500 text-xs">
              {" "}
              {truncateNumber(Mrp, 3)}
            </h1>
            <h1 className=" bg-green-500 p-1 rounded text-xs truncate">
              {Discount}% off
            </h1>
          </div>
          <div className="flex justify-start items-center w-full mt-2">
            <h1 className=" text-green-600">{Offer}</h1>
            {/* <p className="text-sm sm:text-base flex flex-row">Products available {Stock}</p> */}
            {/* <p className=" w-full truncate">{Description}</p> */}
            <h1 className="">{Rating}</h1>
          </div>
          <div className="w-full justify-evenly items-center flex ">
            <Button
              label={
                <h1 className="flex justify-center items-center gap-5">
                  Add to Cart <ShoppingCart />
                </h1>
              }
              className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-black `}
              onClick={addProductToCart}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

// export default ProductCard;
export default LoadingUI(ProductCard);
