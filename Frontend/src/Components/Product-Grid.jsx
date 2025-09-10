import React from "react";
import { truncateString } from "../Utility/Utility-functions";
import { Link, useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { addCart } from "../Utility/Slice/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../Utility/FetchFromApi";

export const ThreeProductGrid = ({ heading = "", products = [] }) => {
  if (!products.length || products.length > 4) return;
  const Navigate = useNavigate();
  const user = useSelector((store) => store.UserInfo.user[0]);
  const dispatch = useDispatch();
  const addProductToCart = async ({ productId }) => {
    try {
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
      Navigate("/login");
      alert(
        err.response?.data?.message ||
          "Please Login first!, Failed to add product to cart."
      );
    }
  };

  return (
    <div className="product-grid lg:h-[30vw] lg:w-[30vw] w-full flex flex-col justify-evenly rounded-xl drop-shadow-2xl bg-neutral-300 ">
      <h2 className="uppercase tracking-widest text-center font-semibold text-gray-800 p-2">
        {heading}
      </h2>
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
            }  flex flex-col justify-center overflow-hidden hover:shadow-xl duration-300 ease-in-out m-1 p-1 rounded-xl`}
          >
            <div
              className={`w-full ${
                products.length === 3 && index === 0 ? "h-fit" : "h-4/5 "
              }  flex justify-between items-start p-1 overflow-hidden rounded-lg `}
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
              <button
                onClick={() => addProductToCart({ productId: product._id })}
                className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-black p-1 rounded-full`}
              >
                <ShoppingCart />
              </button>
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
