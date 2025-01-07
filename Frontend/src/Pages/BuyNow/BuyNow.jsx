import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";

const BuyNow = () => {
  const { productId } = useParams(); // Assuming productId is passed via URL
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await FetchData(`products/${productId}`, "get");
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError("Failed to load product details.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch product details."
        );
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const response = await FetchData("user/addresses", "get");
        if (response.data.success) {
          setAddresses(response.data.data);
        } else {
          setError("Failed to load addresses.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch addresses.");
      }
    };

    fetchProductDetails();
    fetchUserAddresses();
  }, [productId]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleBuyNow = async () => {
    try {
      const response = await FetchData("orders/place", "post", {
        productId,
        addressId: selectedAddress,
      });
      if (response.data.success) {
        alert("Order placed successfully!");
      } else {
        setError("Failed to place order.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <div className="buy-now-page">
      {error && <p className="error-message">{error}</p>}

      {product && (
        <div className="product-details">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      )}

      <div className="address-selection">
        <h2>Select Shipping Address</h2>
        {addresses.length > 0 ? (
          <select value={selectedAddress} onChange={handleAddressChange}>
            <option value="" disabled>
              Select an address
            </option>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {`${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`}
              </option>
            ))}
          </select>
        ) : (
          <p>No addresses available. Please add one in your profile.</p>
        )}
      </div>

      <button onClick={handleBuyNow} disabled={!selectedAddress}>
        Buy Now
      </button>
    </div>
  );
};

export default BuyNow;
