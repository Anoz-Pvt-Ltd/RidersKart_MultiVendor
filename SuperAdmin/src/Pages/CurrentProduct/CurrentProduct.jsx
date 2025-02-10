import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";

const CurrentProduct = () => {
  const { productId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentProduct, setCurrentProduct] = useState([]);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };
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

  const handleDeleteProduct = async () => {
    try {
      const response = await FetchData(
        `products/admin/single-product/${productId}`,
        "delete"
      );
      console.log(response);
      if (response.data) {
        alert(response.data.message);
        handleHome();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="flex justify-evenly items-center flex-col">
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
          <Button
            label={"Delete Product"}
            onClick={handleDeleteProduct}
            className={"hover:bg-red-500"}
          />
          {/* <Button label={"Ban Product"} /> */}
          {/* <Button label={"Edit Product"} /> */}
        </div>
      </div>
      <div className="flex justify-evenly items-center px-4 py-10 bg-white shadow-m rounded-xl w-3/4 ">
        <div className="w-full flex justify-center flex-col items-center">
          <h1 className="text-center text-2xl mb-10 font-semibold">
            Product Description
          </h1>
          {[
            { label: "Name", value: currentProduct?.name },
            { label: "Description", value: currentProduct?.description },
            { label: "Price", value: `₹ ${currentProduct?.price}` },
            { label: "Quantity", value: currentProduct?.stockQuantity },
            { label: "Created At", value: currentProduct?.createdAt },
            { label: "Category", value: currentProduct?.category?.main },
            { label: "Sub-Category", value: currentProduct?.category?.sub },
          ].map((item, index) => (
            <h2
              key={index}
              className="flex justify-between items-center gap-10 w-1/2 border-b border-neutral-300 m-1"
            >
              {item.label}:{" "}
              <span className="text-xl font-bold  w-full text-right">
                {item.value}
              </span>
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentProduct;
