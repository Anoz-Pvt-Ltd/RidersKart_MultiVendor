import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import Button from "./Button";

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
}) => {
  return (
    <Link to={`/current-product/${productId}`} className={`w-fit ${className}`}>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 duration-300 ease-in-out flex ">
        <div className="text-2xl p-2 bg-neutral-200 m-1 w-1/2">
          <img
            src={Image}
            alt="No Image Found"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="h-1/3 px-4 py-3 gap-2 flex flex-col w-1/2">
          <h1 className="text-xl sm:text-2xl font-semibold truncate">
            {ProductName}
          </h1>
          <div className="flex w-full justify-start items-center gap-4 sm:gap-10">
            <h1 className=" ">₹ {CurrentPrice}</h1>
            <h1 className="line-through text-gray-500">₹{Mrp}</h1>
          </div>
          <div className="flex justify-start items-center w-full gap-4 sm:gap-10 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500"
                  fill="yellow"
                />
              ))}
            </div>
          </div>
          <Button
            className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
            label={
              <h1>
                <ShoppingCart className="w-5 h-5 mr-2" />{" "}
              </h1>
            }
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
