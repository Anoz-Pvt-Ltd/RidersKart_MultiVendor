import React from "react";

const CartPage = () => {
  // Sample cart items
  const cartItems = [
    {
      id: 1,
      name: "Product 1",
      image: "https://via.placeholder.com/150",
      price: 20,
      quantity: 3,
    },
    {
      id: 2,
      name: "Product 2",
      image: "https://via.placeholder.com/150",
      price: 30,
      quantity: 1,
    },
  ];

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-md p-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
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
                    <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                  <p className="font-medium">₹ {item.price * item.quantity}</p>
                  <button className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white shadow-md rounded-md p-4">
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
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
