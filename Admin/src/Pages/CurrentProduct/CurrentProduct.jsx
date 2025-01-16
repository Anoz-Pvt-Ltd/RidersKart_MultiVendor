import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";

const CurrentProduct = () => {
  const { productId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentProduct, setCurrentProduct] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `products/admin/get-single-product/${productId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setCurrentProduct(response.data.data);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    fetchProduct();
  }, [user]);

  // console.log(currentProduct);

  return (
    <div className="flex justify-evenly items-center">
      <div>
        <h2>
          Vendor Id:{" "}
          <span className="text-xl font-bold">{currentProduct?.vendor}</span>
        </h2>
        <h1>
          CurrentProduct Id:{" "}
          <span className="text-xl font-bold">{currentProduct?._id}</span>
        </h1>
        <div className="flex justify-evenly items-center gap-5 py-10">
          <Button label={"Delete Product"} />
          <Button label={"Ban Product"} />
          <Button label={"Edit Product"} />
        </div>
      </div>
      <div className="flex justify-evenly items-center px-4 py-10">
        <div>
          <h1 className="text-center text-2xl mb-10 font-semibold">
            Product Description
          </h1>
          <h2>
            Name:{" "}
            <span className="text-xl font-bold">{currentProduct?.name}</span>
          </h2>
          <h2>
            Description:{" "}
            <span className="text-xl font-bold">
              {currentProduct?.description}
            </span>
          </h2>
          <h2>
            Price: ₹{" "}
            <span className="text-xl font-bold">{currentProduct?.price}</span>
          </h2>
          <h2>
            Quantity:{" "}
            <span className="text-xl font-bold">
              {currentProduct?.quantity}
            </span>
          </h2>
          <h2>
            Created At:{" "}
            <span className="text-xl font-bold">
              {currentProduct?.createdAt}
            </span>
          </h2>
          <h2>
            Category:{" "}
            <span className="text-xl font-bold">
              {currentProduct?.category?.main}
            </span>
          </h2>
          <h2>
            Sub-Category:{" "}
            <span className="text-xl font-bold">
              {currentProduct?.category?.sub}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CurrentProduct;
