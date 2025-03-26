import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";
import ProductCardMobile from "../../Components/ProductCardMobile";
import LoadingUI from "../../Components/Loading";
import { addQuantity, subtractQuantity } from "../../Utility/Slice/CartSlice";

const CartPage = ({ startLoading, stopLoading }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  const cart = useSelector((store) => store.CartList.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `users/${user?.[0]._id}/cart-products`,
            "get"
          );
          if (response.data.success) {
            setCartProducts(response.data.data);
          } else {
            setError("Failed to load cart products.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch cart products."
          );
        } finally {
          stopLoading();
        }
      }
    };

    fetchCartProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      startLoading();
      const response = await FetchData("products/get-all-product", "get");
      if (response.data.success) {
        setProducts(response.data.data.products);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      startLoading();
      console.log("productId", productId);
      console.log("user", user[0]._id);
      const response = await FetchData(
        `users/${user[0]._id}/${productId}/cart/remove`,
        "delete"
      );
      console.log(response);

      alert(response.data.message);
      console.log(productId);
      dispatch(addCart(productId));
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Failed to remove product from cart. Please try again."
      );
    } finally {
      stopLoading();
    }
  };

  function getTotalPayablePrice() {
    return cart.reduce((total, item) => {
      if (!item.product) return total;
      return total + item.product.price.sellingPrice * item.quantity;
    }, 0);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="flex flex-col w-full gap-4 justify-between items-center">
          <div className="flex flex-col lg:flex-row w-full justify-around items-start ">
            <div className="lg:col-span-2 lg:w-1/2 w-full  border">
              <div className="bg-white shadow-md rounded-md p-4">
                {cart?.map((item) =>
                  item.product === null ? (
                    <></>
                  ) : (
                    <div
                      key={item._id}
                      className="flex flex-col gap-5 md:flex-row items-center justify-between border-b pb-4 mb-4"
                    >
                      <div className="flex justify-between gap-10 mt-5 w-full  ">
                        <div className="w-20 h-20 flex justify-center items-center">
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 px-4">
                          <h2 className="font-medium text-lg">
                            {item.product.name}
                          </h2>
                          <p className="text-gray-600">
                            ₹ {item.product.price.sellingPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-10 ">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              dispatch(subtractQuantity(item.product._id))
                            }
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(addQuantity(item.product._id))
                            }
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium">
                          ₹ {item.product.price.sellingPrice * item.quantity}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeFromCart(item.product._id)}
                        label="Remove"
                        className="bg-white hover:bg-orange-500 hover:text-white"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Order summery */}
            <div className="bg-white shadow-md rounded-md p-4 lg:w-1/4 w-full">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹ {getTotalPayablePrice()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Tax</p>
                <p>₹ {(getTotalPayablePrice() * 0.1).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold mb-4">
                <p>Total</p>
                <p>₹ {(getTotalPayablePrice() * 1.1).toFixed(2)}</p>
              </div>
              <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
      <h1 className="text-xl mx-4 my-10 w-full text-center border-t border-neutral-400 font-bold">
        Recommendations
      </h1>
      {products.length === 0 ? (
        <div>
          <h1>No Recommendations available </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 w-full">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                ProductName={product.name}
                CurrentPrice={product.price.sellingPrice}
                Mrp={product.price.MRP}
                Rating={product.rating || "No rating"}
                Offer="No offer"
                Category={product.category.main}
                StockQuantity={product.stockQuantity}
                className={`hidden lg:block`}
              />
            ))}
          </div>
          <div className="flex lg:hidden flex-col gap-4 bg-transparent justify-start items-center overflow-x-auto w-full">
            {products?.map((product) => (
              <ProductCardMobile
                key={product._id}
                ProductName={product.name}
                CurrentPrice={product.price.sellingPrice}
                Mrp={product.price.MRP}
                Rating={product.rating || "No rating"}
                Offer="No offer"
                Category={product.category.main}
                StockQuantity={product.stockQuantity}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingUI(CartPage);
