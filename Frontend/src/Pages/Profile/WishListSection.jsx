import React, { useEffect, useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";
import { useSelector } from "react-redux";
import { ProductCardResponsive } from "../../Components/ProductCard";

const WishListSection = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [wishlistProducts, setWishlistProducts] = useState();
  const [error, setError] = useState(null);

  const fetchWishlistProducts = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `users/${user?.[0]?._id}/wishlist-products`,
          "get"
        );
        if (response.data.success) {
          setWishlistProducts(response.data.data);
        } else {
          setError("Failed to load Wishlist products.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch Wishlist products."
        );
      } finally {
        stopLoading();
      }
    }
  };
  useEffect(() => {
    fetchWishlistProducts();
  }, [user]);
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      {/* Wishlist content */}
      <h1>
        Your wishlist is here with {""}
        <span>{wishlistProducts?.length} items.</span>
      </h1>

      <div className="flex justify-start items-start gap-5 flex-wrap lg:p-5">
        {wishlistProducts?.map((product, index) => (
          <ProductCardResponsive
            Image={product?.images[0]?.url}
            key={index}
            ProductName={product?.name}
            CurrentPrice={product?.price?.sellingPrice}
            Mrp={product?.price?.MRP}
            // Rating={product?.products?.[0]?.product?.Rating}
            Discount={product?.price?.discount}
            Description={product?.description}
            productId={product?._id}
          />
        ))}
      </div>
    </section>
  );
};

export default LoadingUI(WishListSection);
