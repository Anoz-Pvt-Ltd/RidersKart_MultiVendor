import React from "react";
import { truncateString } from "../Utility/Utility-functions";
import { Link } from "react-router";

export const ThreeProductGrid = ({ heading = "", products = [] }) => {
  if (!products.length || products.length > 4) return;

  return (
    <div className="product-grid lg:h-[30vw] lg:w-[30vw] w-full flex flex-col justify-evenly bg-white rounded-xl drop-shadow-2xl ">
      <h2 className="uppercase tracking-widest text-center font-semibold text-gray-800 p-2">{heading}</h2>
      <div className="grid grid-cols-2 grid-rows-2 h-5/6 ">
        {products.map((product, index) => (
          <Link
            to={`/current-product/${product._id}`}
            key={product._id}
            className={`${
              products.length === 3 && index === 0 ? "row-span-2" : " "
            } ${
              products.length === 3 && index === 2
                ? "col-start-2 row-start-2"
                : ""
            }  flex flex-col justify-center overflow-hidden shadow hover:shadow-xl duration-300 ease-in-out m-1`}
          >
            <div
              className={`w-full ${
                products.length === 3 && index === 0 ? "h-fit" : "h-4/5 "
              }  flex justify-center items-center p-1 overflow-hidden rounded-lg `}
            >
              <img
                src={product.images[0].url}
                alt={product.name}
                className={`${
                  products.length === 3 && index === 0 ? "w-full" : "h-full "
                } ${
                  products.length === 3 && index > 0 ? "h-full" : " "
                } rounded-lg h-20 w-20 lg:h-32 lg:w-32 object-contain`}
              />
            </div>
            <div className="flex flex-col justify-center items-center ">
              <h3 className=" font-semibold text-gray-800">
                {truncateString(product.name, 20)}
              </h3>
              <div className="flex lg:gap-1 flex-col  justify-center items-center">
                <span className=" font-bold">
                  ₹{product.price.sellingPrice}
                </span>
                <span className="line-through text-xs">
                  {product.price.MRP}
                </span>
                {product.price.discount > 0 && (
                  <span className=" bg-green-400 px-2 rounded-xl text-xs">
                    {product.price.discount}% off
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Add more products here */}
      {/* <Product product={products[3]} /> */}
    </div>
  );
};
