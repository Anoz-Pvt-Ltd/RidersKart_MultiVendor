import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentProduct = ({ startLoading, stopLoading }) => {
  const { productId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Active Products");
  const [currentProduct, setCurrentProduct] = useState([]);
  const [currentBrand, setCurrentBrand] = useState([]);
  const [currentSubCategory, setCurrentSubCategory] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [currentVendor, setCurrentVendor] = useState([]);
  const [model, openModel] = useState(false);
  const [model2, openModel2] = useState(false);
  const [model3, openModel3] = useState(false);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };
  const fetchProduct = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `products/admin/get-single-product/${productId}`,
          "get"
        );
        console.log(response);
        setCurrentProduct(response.data.data);
        setCurrentBrand(response.data.data.brand);
        setCurrentSubCategory(response.data.data.subcategory);
        setCurrentVendor(response.data.data.vendor);
        setCurrentCategory(response.data.data.category);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        stopLoading();
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [user]);

  const handleDeleteProduct = async () => {
    try {
      startLoading();
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
    } finally {
      stopLoading();
    }
  };

  const handleActiveProduct = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/admin/single-product-active/${productId}`,
        "post"
      );
      console.log(response);
      alert(response.data.message);
      openModel2(false);
      fetchProduct();
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const handleSuspendProduct = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/admin/single-product-suspend/${productId}`,
        "post"
      );
      console.log(response);
      alert(response.data.message);
      openModel3(false);
      fetchProduct();
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-evenly items-center flex-col">
      <div>
        <h2>
          Vendor Id:{" "}
          <span className="text-xl font-bold">
            {currentProduct?.vendor?._id}
          </span>
        </h2>
        <h1>
          CurrentProduct Id:{" "}
          <span className="text-xl font-bold">{currentProduct?._id}</span>
        </h1>
        <div className="flex justify-evenly items-center gap-5 py-10">
          <Button label={"Delete Product"} onClick={() => openModel(true)} />
          {currentProduct?.status === "active" ? (
            <Button
              label={"Suspend Product"}
              onClick={() => openModel3(true)}
            />
          ) : (
            <Button
              label={"Activate Product"}
              onClick={() => openModel2(true)}
            />
          )}
        </div>
      </div>
      <div className="flex justify-evenly items-center px-4 py-10 bg-white shadow-m rounded-xl w-full  ">
        <div className="w-full flex justify-center flex-col items-center">
          <h1 className="text-center text-2xl mb-10 font-semibold">
            Product Description
          </h1>
          {[
            { label: "Name", value: currentProduct?.name },
            {
              label: "Product Image/s",
              value: (
                <div className="w-full flex justify-end items-center">
                  {currentProduct?.images?.map((image) => (
                    <img
                      alt="no image found"
                      className="w-20 h-20 mx-2 border object-contain"
                      src={image.url}
                    />
                  ))}
                  {/* <img
                    src={currentProduct?.images?.[0]?.url}
                    alt="no image found"
                    className="w-20 h-20 "
                  /> */}
                </div>
              ),
            },
            { label: "Brand", value: currentBrand?.title },
            {
              label: "Brand Logo",
              value: (
                <div className="w-full flex justify-end items-center">
                  <img src={currentBrand?.logo?.url} className="w-20 h-20 " />
                </div>
              ),
            },
            {
              label: "Description",
              value: (
                <div className="text-justify">
                  {currentProduct?.description}
                </div>
              ),
            },
            { label: "SubCategory", value: currentSubCategory?.title },
            {
              label: "SubCategory Image",
              value: (
                <div className="w-full flex justify-end items-center">
                  <img
                    src={currentSubCategory?.image?.url}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              ),
            },
            { label: "SubCategory ID", value: currentSubCategory?._id },
            { label: "Category", value: currentCategory?.title },

            { label: "Category ID", value: currentCategory?._id },
            {
              label: "Price",
              value: `₹ ${currentProduct?.price?.sellingPrice}`,
            },
            { label: "Quantity", value: currentProduct?.stockQuantity },
            { label: "SKU", value: currentProduct?.sku },
            {
              label: "Specifications",
              // value: currentProduct?.specifications?.details,
              value: (
                <div className="text-justify">
                  {currentProduct?.specifications?.details}
                </div>
              ),
            },
            { label: "Product Created At", value: currentProduct?.createdAt },
            { label: "Vendor Name", value: currentVendor?.name },
            { label: "Vendor Email", value: currentVendor?.email },
            {
              label: "Vendor Contact Number",
              value: currentVendor?.contactNumber,
            },

            // { label: "Category", value: currentProduct?.category?._id },
            // { label: "Sub-Category", value: currentProduct?.subcategory?._id },
          ].map((item, index) => (
            <h2
              key={index}
              className="flex justify-between items-center gap-10 w-3/4 border-b border-neutral-300 m-1 px-5"
            >
              <h1 className="text-nowrap font-bold">{item.label} :</h1>{" "}
              <span className="w-full text-right">{item.value}</span>
            </h2>
          ))}
        </div>
      </div>
      {model && (
        <div className="flex justify-center items-center h-screen w-full fixed bg-white top-0 left-0 flex-col gap-5">
          <h1>Are you sure you want to DELETE the product permanently ?</h1>
          <div className="flex justify-center items-center gap-5">
            <Button label={"Cancel"} onClick={() => openModel(false)} />
            <Button label={"Confirm"} onClick={handleDeleteProduct} />
          </div>
        </div>
      )}
      {model2 && (
        <div className="flex justify-center items-center h-screen w-full fixed bg-white top-0 left-0 flex-col gap-5">
          <h1>Are you sure you want to ACTIVATE the product ?</h1>
          <div className="flex justify-center items-center gap-5">
            <Button label={"Cancel"} onClick={() => openModel2(false)} />
            <Button label={"Confirm"} onClick={handleActiveProduct} />
          </div>
        </div>
      )}
      {model3 && (
        <div className="flex justify-center items-center h-screen w-full fixed bg-white top-0 left-0 flex-col gap-5">
          <h1>Are you sure you want to SUSPEND the product ?</h1>
          <div className="flex justify-center items-center gap-5">
            <Button label={"Cancel"} onClick={() => openModel3(false)} />
            <Button label={"Confirm"} onClick={handleSuspendProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(CurrentProduct);
