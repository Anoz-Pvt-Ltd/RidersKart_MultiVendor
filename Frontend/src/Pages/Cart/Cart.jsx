import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";
import ProductCardMobile from "../../Components/ProductCardMobile";
import LoadingUI from "../../Components/Loading";

const CartPage = ({ startLoading, stopLoading }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);

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
        setProducts(response.data.data);
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

  const updateQuantity = (productId, operation) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity:
                operation === "increase"
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const removeProduct = (productId) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((item) => item._id !== productId)
    );
  };

  const calculateTotal = () => {
    return cartProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  console.log(cartProducts);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartProducts.length > 0 ? (
        <div className="flex flex-col w-full gap-4 justify-between items-center">
          <div className="flex w-full justify-around items-center ">
            <div className="lg:col-span-2 w-1/2">
              <div className="bg-white shadow-md rounded-md p-4">
                {cartProducts.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-4 mb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 px-4">
                      <h2 className="font-medium text-lg">{item.name}</h2>
                      <p className="text-gray-600">₹ {item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, "decrease")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, "increase")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">
                      ₹ {item.price * item.quantity}
                    </p>
                    <Button
                      onClick={() => removeProduct(item._id)}
                      label="Remove"
                      className="hover:bg-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-md p-4 w-1/4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹ {calculateTotal()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Tax</p>
                <p>₹ {(calculateTotal() * 0.1).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold mb-4">
                <p>Total</p>
                <p>₹ {(calculateTotal() * 1.1).toFixed(2)}</p>
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

      
      <div className="flex flex-row gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 w-full">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            ProductName={product.name}
            CurrentPrice={product.price}
            Mrp={product.price}
            Rating={product.rating || "No rating"}
            Offer="No offer"
            Category={product.category.main}
            StockQuantity={product.stockQuantity}
            className={`hidden lg:block`}
          />
        ))}
      </div>
      <div className="flex lg:hidden flex-col gap-4 bg-transparent justify-start items-center overflow-x-auto w-full">
        {products.map((product) => (
          <ProductCardMobile
            key={product._id}
            ProductName={product.name}
            CurrentPrice={product.price}
            Mrp={product.price}
            Rating={product.rating || "No rating"}
            Offer="No offer"
            Category={product.category.main}
            StockQuantity={product.stockQuantity}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(CartPage);
