import React, { useLayoutEffect } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Button from "../../Components/Button";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Heart, User, X } from "lucide-react";
import LoadingUI from "../../Components/Loading";
import PopUp from "../../Components/PopUpWrapper";
import { addCart } from "../../Utility/Slice/CartSlice";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";
import Policies from "./policies";
import { Card } from "../../Components/ProductCard";
import {
  checkPincodeAvailability,
  FilterByPincode,
} from "../../Utility/FilterByPincode";
import { PinCodeData } from "../../Constants/PinCodeData.js";
import InputBox from "../../Components/InputBox.jsx";
import { alertError, alertInfo, alertSuccess } from "../../Utility/Alert.js";
import { truncateString } from "../../Utility/Utility-functions.js";
import MapInput from "../../Components/MapInput.jsx";
import { AnimatePresence, motion } from "framer-motion";

const CurrentProduct = ({ startLoading, stopLoading }) => {
  const [isReadMoreDescription, setIsReadMoreDescription] = useState(false);
  const [isReadMoreSpecification, setIsReadMoreSpecification] = useState(false);
  const maxLength = 100;
  const toggleReadMore = () => {
    setIsReadMoreDescription((prev) => !prev);
  };
  const toggleReadMoreSpecification = () => {
    setIsReadMoreSpecification((prev) => !prev);
  };
  const user = useSelector((store) => store.UserInfo.user);
  const isProductAvailableForUser = useSelector(
    (store) => store.UserInfo.isProductAvailableForUser
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { productId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [imgPopup, setImgPopup] = useState(false);
  const [buyNowPopUp, setBuyNowPopUp] = useState(false);
  const [addressPopUp, setAddressPopUp] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [products, setProducts] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [AllProducts, setAllProducts] = useState();
  const [specifications, setSpecifications] = useState("");
  const [productPolicy, setProductPolicy] = useState([]);
  const userPostalCode = user[0]?.defaultAddress?.postalCode;
  const [pincode, setPincode] = useState("");
  const [availability, setAvailability] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // this is a function for fetching all the users who have rated in this product
    // so that we can show their names and profile pics
    const fetchUsers = async () => {
      try {
        // get unique ids
        const userIds = [...new Set(ratings.map((r) => r.user))];

        if (userIds.length > 0) {
          // API: /users/bulk (you should build this endpoint in backend)
          const response = await FetchData(
            "users/get-bulk-name-rating",
            "post",
            {
              ids: userIds,
            }
          );
          // console.log(response);

          // create map { userId: userObj }
          const userMap = {};
          response.data.data.forEach((u) => {
            userMap[u._id] = u;
          });

          setUsers(userMap);
        }
      } catch (err) {
        // console.error("Error fetching users:", err);
      }
    };

    if (ratings?.length > 0) fetchUsers();
  }, [ratings]);

  // 🔹 Auto-check of pincode if user is logged in
  useEffect(() => {
    if (userPostalCode) {
      const isAvailable = checkPincodeAvailability(
        products,
        userPostalCode,
        PinCodeData
      );
      setAvailability(isAvailable);
    }
  }, [userPostalCode, products]);

  // 🔹 Manual check of pincode for guest users
  const handleCheck = () => {
    if (!pincode) {
      alertInfo("Please enter a pincode");
      return;
    }

    // ✅ Check if pincode exists in PinCodeData
    let pincodeExists = false;
    for (let state in PinCodeData) {
      for (let city in PinCodeData[state]) {
        if (PinCodeData[state][city].includes(pincode)) {
          pincodeExists = true;
          break;
        }
      }
      if (pincodeExists) break;
    }

    if (!pincodeExists) {
      alertError("Invalid pincode");
      setAvailability(null);
      return;
    }

    // ✅ Now check availability for this product
    const isAvailable = checkPincodeAvailability(
      products, // pass a single product, not the array
      pincode,
      PinCodeData
    );
    setAvailability(isAvailable);
  };

  const productRef = useRef(null);
  // console.log(user[0]?._id);

  // Utility functions
  const HandleBuyNow = async () => {
    if (user.length > 0) {
      try {
        startLoading();

        // Ensure all required fields are included
        const response = await FetchData(`orders/create-order`, "post", {
          userId: user[0]._id,
          products: [
            { product: productId, quantity: 1, price: products?.price },
          ],
          // shippingAddress: addresses[selectedAddress],
          totalAmount: products?.price.sellingPrice,
        });
        // console.log(response);

        if (response.data.success) {
          // alert("Order placed successfully!");
          navigate(`/checkout/${productId}/${response.data.data._id}`);
        }
      } catch (err) {
        // console.log(err);
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    } else {
      alertInfo("Please Login first!");
      navigate("/login");
    }
  };

  // Fetching the current product
  useEffect(() => {
    async function getCurrentProduct(productId) {
      startLoading();
      const Product = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      // console.log(Product);
      setProducts(Product?.data?.data);
      setRatings(Product?.data?.data?.ratings);
      setSpecifications(Product?.data?.data?.specifications);
      stopLoading();
      return Product;
    }

    setTimeout(() => {
      productRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    getCurrentProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (!products) return;

    async function fetchProductPolicy() {
      try {
        // startLoading();
        const response = await FetchData(`policies/policy-by-category`, "get", {
          categoryId: products.category._id,
          subcategoryId: products.subcategory._id,
          brandId: products.brand._id,
          productId,
        });
        // console.log(response.data.data);
        setProductPolicy(response.data.data);
      } catch (err) {
        // console.error(err);
      } finally {
        // stopLoading();
      }
    }

    fetchProductPolicy();
  }, [products]);

  // Fetching all products
  useEffect(() => {
    //suggestions of products at bottom
    const fetchProducts = async () => {
      try {
        // startLoading();
        const response = await FetchData("products/get-all-products", "get");
        // console.log(response);
        let allProducts = response.data.data.products;
        const allowedProducts = allProducts.filter(
          (product) => !product.status || product.status === "active"
        );

        // further filter products based on pincode
        const filtered = FilterByPincode(
          allowedProducts,
          userPostalCode,
          PinCodeData
        );

        setAllProducts(filtered);
        // console.log("filtered", filtered);
        // setProducts(response.data.data.products);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        // stopLoading();
      }
    };
    fetchProducts();
  }, []);

  const addProductToCart = async () => {
    if (user.length === 0) {
      alertInfo("Please Login first");
      navigate("/login");
    } else {
      try {
        startLoading();
        const response = await FetchData(
          `users/${user?.[0]?._id}/${products?._id}/cart/add`,
          "post"
        );
        // console.log(response);

        alertSuccess(response.data.message);
        // console.log(products);
        dispatch(addCart(products));
        // console.log(products);
      } catch (err) {
        // console.log(err);
        alertError(
          err.response?.data?.message ||
            "Internal server error Please try after sometime !"
        );
      } finally {
        stopLoading();
      }
    }
  };

  const addProductToWishlist = async () => {
    if (user.length === 0) {
      alertInfo("Please Login first");
    } else {
      try {
        startLoading();
        const response = await FetchData(
          `users/${user?.[0]?._id}/${products?._id}/wishlist/add`,
          "post"
        );
        // console.log(response);
        alertSuccess(response.data.message);
      } catch (err) {
        // console.log(err);
        // alert(
        //   err.response?.data?.message ||
        //     "Please Login first! , Failed to add product to Wishlist."
        // );
        if (user.length > 0) {
          alertError(err.response?.data?.message || "Internal Server Error");
        }
        if (user.length === 0) {
          alertError(
            err.response?.data?.message ||
              "Please Login first! , Failed to add product to Wishlist."
          );
        }
      } finally {
        stopLoading();
      }
    }
  };

  const sliderRef = useRef(null);

  // Function to scroll the products left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Function to scroll the products right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const ReadOnlyStars = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${
            star <= rating ? "text-[#FE4343]" : "text-[#FE4343]"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  const RatingUI = ({ reviews }) => {
    // reviews example: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, ...]

    if (!reviews || reviews.length === 0) {
      return (
        <div className="max-w-md w-full bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-2">Customer reviews</h2>
          <p className="text-gray-600 text-xs">No reviews yet.</p>
        </div>
      );
    }

    const totalRatings = reviews.length;

    // Calculate average
    const average =
      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalRatings;

    // Calculate breakdown percentages
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[r.rating]++;
      }
    });

    const breakdownPercent = {};
    for (let star = 1; star <= 5; star++) {
      breakdownPercent[star] = ((breakdown[star] / totalRatings) * 100).toFixed(
        0
      );
    }

    return (
      <div className="max-w-md w-full bg-white p-4 rounded-lg shadow">
        {/* Heading */}
        <h2 className="text-xl font-bold mb-2">Customer reviews</h2>

        {/* Average rating */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex text-[#FE4343] text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(average) ? "" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-lg font-semibold">
            {average.toFixed(1)} out of 5
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {totalRatings} global ratings
        </p>

        {/* Breakdown */}
        <div className="flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 cursor-pointer hover:underline w-10">
                {star} star
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-[#FE4343] h-4"
                  style={{ width: `${breakdownPercent[star]}%` }}
                ></div>
              </div>
              <span className="w-10 text-blue-600">
                {breakdownPercent[star]}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RatingProduct = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
      return <p className="text-gray-600 text-xs">No reviews yet.</p>;
    }

    const totalRatings = reviews.length;

    // Calculate average
    const average =
      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalRatings;
    return (
      <h1>
        <span className="text-lg font-semibold">⭐️{average.toFixed(1)}</span>
      </h1>
    );
  };

  const makeDefaultAddress = async (addressId) => {
    try {
      startLoading();
      await FetchData(
        `users/${user?.[0]?._id}/addresses/${addressId}/set-default-address`,
        "post"
      );
      alertSuccess("Default address set successfully");
      // Set flag in localStorage
      localStorage.setItem("showBuyNowPopUp", "true");
      window.location.reload();
    } catch (err) {
      alertError(
        err.response?.data?.message || "Failed to set default address."
      );
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (user[0]?.defaultAddress?.coordinates?.length === 0) {
      if (localStorage.getItem("showBuyNowPopUp") === "true") {
        setBuyNowPopUp(true);
        localStorage.removeItem("showBuyNowPopUp");
      }
    }
  }, []);

  return (
    <div className="mt-2 h-fit">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:p-4 ">
        <section
          ref={productRef}
          className="ImageSection w-full lg:w-[40vw] lg:sticky top-0 left-0"
        >
          <div className="flex flex-col-reverse lg:flex-row h-5/6 lg:mb-10 ">
            {/* Image Array */}
            <div className="lg:w-20 lg:h-full  ">
              <div className="overflow-x-auto flex lg:flex-col flex-row justify-start items-center mt-2  gap-2 bg-neutral-400 rounded-xl m-4 lg:m-0">
                {products?.images.map((image, index) => (
                  <img
                    key={index}
                    onClick={() => setCurrentImg(index)}
                    src={image.url}
                    alt={products?.name}
                    className="h-10 w-10 m-2 cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Current Image */}
            <div className="relative h-full lg:w-[40vw] p-3 m-2 ">
              <motion.img
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                src={products?.images[currentImg]?.url}
                alt={products?.name}
                className="h-96 w-96 object-contain bg-neutral-200 rounded-xl"
                onClick={() => setImgPopup(true)}
              />
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                className="absolute top-0 right-0"
              >
                <Button
                  label={<Heart className=" overflow-hidden" />}
                  className={`hover:bg-white hover:text-red-500 rounded-full`}
                  onClick={addProductToWishlist}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className=""
          >
            {userPostalCode ? (
              <>
                {/* Auto availability check for logged-in users */}
                {availability ? (
                  <div className="flex gap-10 lg:gap-52 justify-center items-center lg:ml-20 ">
                    {user[0]?.defaultAddress?.coordinates.length === 0 ? (
                      <Button
                        label={"Buy Now"}
                        className="text-white w-36 h-12"
                        onClick={() => setBuyNowPopUp(true)}
                      />
                    ) : (
                      <Button
                        label={"Buy Now"}
                        className="bg-[#ff741b] hover:bg-[#ff924e] text-white w-36 h-12"
                        onClick={HandleBuyNow}
                      />
                    )}
                    <Button
                      label={"Add to Cart"}
                      className="bg-[#ff9f00] hover:bg-[#ffbb4e] text-white w-36 h-12"
                      onClick={addProductToCart}
                    />
                  </div>
                ) : (
                  <div className="flex gap-10 lg:gap-52 justify-center items-center lg:ml-20 bg-[#DF3F33] text-white p-4 rounded-lg">
                    This product is not available for your location (
                    {userPostalCode})
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Manual pincode check for guests */}
                <div className="">
                  <div className="flex flex-col lg:flex-row justify-center items-center lg:gap-5">
                    <InputBox
                      LabelName="Enter Pincode to check product availability "
                      Placeholder="Enter here"
                      Type="text"
                      Value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                    <Button onClick={handleCheck} label={"Check"} />
                  </div>
                  <h1 className="text-sm text-red-600 text-center">
                    * Kindly update your current address on your profile !
                  </h1>
                </div>

                {availability !== null && (
                  <>
                    {availability ? (
                      <div className="flex flex-col justify-center items-center gap-3">
                        <div className="flex gap-10 lg:gap-52 justify-center items-center bg-green-500 text-white p-4 rounded-lg w-full">
                          This product is available for your location ({pincode}
                          )
                        </div>
                        <div className="flex w-full justify-evenly items-center ">
                          {user[0]?.address[0]?.coordinates === 0 ? (
                            <Button
                              label={"Buy Now"}
                              className="bg-[#ff741b] hover:bg-[#ff924e] text-white w-36 h-12"
                              onClick={HandleBuyNow}
                            />
                          ) : (
                            <h1>Please enter your location</h1>
                          )}
                          <Button
                            label={"Add to Cart"}
                            className="bg-[#ff9f00] hover:bg-[#ffbb4e] text-white w-36 h-12"
                            onClick={addProductToCart}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-10 lg:gap-52 justify-center items-center bg-[#DF3F33] text-white p-4 rounded-lg mt-4">
                        This product is not available for this pincode
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </motion.div>
        </section>
        <div className="flex flex-col lg:px-20 px-4 py-10 justify-start w-full">
          <h3 className="font-semibold mb-2 flex justify-start items-center gap-5">
            <span className="font-light">Brand: </span>
            {products?.brand?.title}
            <span>
              <img
                src={products?.brand?.logo?.url}
                className="w-20 rounded-full"
              />
            </span>
          </h3>
          <h3 className="text-xl font-semibold mb-2">{products?.name}</h3>
          {/* <p className="text-gray-600 mb-4">{products?.description}</p> */}

          <div className="flex items-center lg:my-4 my-2 lg:text-lg text-xs">
            <span className=" font-semibold mr-2 flex justify-center items-center bg-green-400 px-2 rounded-xl">
              {<RatingProduct reviews={ratings} />}
            </span>
            {/* {console.log(ratings)} */}
            <span className="text-gray-500">
              {ratings?.length || 0} Ratings
            </span>
          </div>
          <div className="flex items-baseline mb-4">
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-xl font-bold mr-4"
            >
              ₹ {products?.price.sellingPrice}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
              className="text-gray-500 line-through mr-4"
            >
              ₹{products?.price.MRP}
            </motion.span>
            {products?.price.discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, type: "spring", delay: 0.5 }}
                className="bg-green-500 text-white px-2 py-1 rounded-sm"
              >
                {products?.price.discount}% off
              </motion.span>
            )}
          </div>
          {/* <h4 className="text-lg font-semibold mb-2">Available offers</h4>
          <ul className="list-disc list-inside">
            <li>
              Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
              T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,000 on HDFC Bank Pixel Credit Card EMI
              on 3 months tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Bank Offer 12% off up to ₹1,500 on HDFC Bank Pixel Credit Card EMI
              on 6m and 9m tenure. Min. Txn Value: ₹7,500 T&C
            </li>
            <li>
              Special Price Get extra 20% off (price inclusive of
              cashback/coupon) T&C
            </li>
          </ul> */}

          <div className="lg:mt-5 flex flex-col gap-5">
            {/* description  */}
            <div className="flex flex-col gap-2 bg-white/50 py-2 px-5 rounded-xl shadow-xl">
              <h1 className="font-semibold">Product Description</h1>

              <AnimatePresence initial={false}>
                <motion.div
                  key={isReadMoreDescription ? "expanded" : "collapsed"}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600">
                    {isReadMoreDescription
                      ? products?.description
                      : `${products?.description.substring(0, maxLength)}...`}
                  </p>
                </motion.div>
              </AnimatePresence>

              {products?.description.length > maxLength && (
                <button
                  className="text-blue-500 hover:underline w-fit"
                  onClick={toggleReadMore}
                >
                  {isReadMoreDescription ? "Read Less.." : "Read More..."}
                </button>
              )}
            </div>
            {/* specifications  */}
            <div className="flex flex-col gap-2 bg-white/50 py-2 px-5 rounded-xl shadow-xl">
              <h1 className="font-semibold">Product Specifications</h1>

              <AnimatePresence initial={false}>
                <motion.div
                  key={isReadMoreSpecification ? "expanded" : "collapsed"}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600">
                    {isReadMoreSpecification
                      ? specifications?.details
                      : `${specifications?.details?.substring(
                          0,
                          maxLength
                        )}...`}
                  </p>
                </motion.div>
              </AnimatePresence>

              {specifications?.details?.length > maxLength && (
                <button
                  className="text-blue-500 hover:underline w-fit"
                  onClick={toggleReadMoreSpecification}
                >
                  {isReadMoreSpecification ? "Read Less.." : "Read More..."}
                </button>
              )}
            </div>
            {/* policies  */}
            <div className="h-fit bg-neutral-300 px-5 py-4 rounded-xl shadow-xl">
              <Policies
                categorizedPolicies={productPolicy.categorizedPolicies}
              />
            </div>
          </div>
        </div>
      </div>
      <section className="flex flex-col lg:flex-row justify-between items-center lg:px-20 gap-4 mb-10">
        <div className=" lg:w-1/4 w-full">
          <h1 className=" font-semibold mb-2 ml-10">Product Reviews</h1>
          <RatingUI reviews={ratings} />
        </div>
        <div className=" lg:w-3/4 lg:pl-20 w-full ">
          {ratings?.map((rating) => (
            <div className="flex flex-col w-full shadow px-10 m-2 rounded-xl ">
              <h1 className="flex justify-start items-center gap-2">
                <span>
                  <User className="h-4 w-4" />
                </span>
                {users[rating.user]?.name || "Profile deleted by user"}
              </h1>
              <div className="flex flex-col justify-center items-start">
                <ReadOnlyStars rating={rating.rating} />
                <h1>Review: {truncateString(rating.comment, 30)}</h1>
              </div>
              <p>
                Reviewed on: {new Date(rating.createdAt).toLocaleDateString()}
              </p>
              <p>✅ Verified Purchase</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h1 className=" font-semibold mb-2 ml-10">People Also visited</h1>
      </section>
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          ←
        </button>

        <div
          className="flex overflow-x-scroll no-scrollbar justify-start items-center gap-6 lg:py-10 lg:px-10"
          ref={sliderRef}
        >
          {AllProducts?.map((product, index) => (
            <Card
              Image={product?.images[0]?.url}
              key={product._id}
              ProductName={product.name}
              CurrentPrice={product.price.sellingPrice}
              Mrp={product.price.MRP}
              Rating={product.Rating}
              Offer={product.off}
              Description={product.description}
              productId={product._id}
              Discount={product.price.discount}
              Stock={product.stockQuantity}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          →
        </button>
      </div>
      <AnimatePresence>
        {imgPopup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bg-black/90 top-0 left-0 flex lg:flex-row flex-col-reverse justify-center items-center w-full h-screen lg:gap-10"
          >
            <img
              src={products?.images[currentImg]?.url}
              alt=""
              className="h-[70vh] object-contain"
            />
            <button
              className="lg:h-[70vh] flex justify-start items-start "
              onClick={() => setImgPopup(false)}
            >
              <X className="bg-red-500 w-8 h-8 rounded-full p-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {buyNowPopUp && (
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -100 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 py-5 w-full h-screen overflow-scroll bg-neutral-200 flex justify-center items-start"
          >
            <div className="w-full flex flex-col justify-center items-center">
              <h1>
                Your default selected address does'nt contain Exact location
                where the product will get delivered{" "}
              </h1>
              <div className="flex flex-col justify-center items-center text-sm shadow-xl py-5 bg-white/50 rounded-xl">
                <strong>Default address</strong>{" "}
                <h1 className=" ">
                  <p className="py-2 px-3 w-fit flex gap-2">
                    <li className=" font-semibold list-none">
                      Street:{" "}
                      <span className="font-normal  ">
                        {truncateString(
                          user?.[0]?.defaultAddress?.street || "Not available",
                          20
                        )}
                        ,
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      City:{" "}
                      <span className="font-normal  ">
                        {user?.[0]?.defaultAddress?.city || "Not available"},
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Country:{" "}
                      <span className="font-normal  ">
                        {user?.[0]?.defaultAddress?.country || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Postal Code:{" "}
                      <span className="font-normal  ">
                        {user?.[0]?.defaultAddress?.postalCode ||
                          "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      State:{" "}
                      <span className="font-normal  ">
                        {user?.[0]?.defaultAddress?.state || "Not available"}
                      </span>
                    </li>
                  </p>
                </h1>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setAddressPopUp(true)}
                >
                  Select another address
                </button>
              </div>
              <div className="flex justify-center items-center gap-5 py-5">
                <Button
                  label={"Cancel"}
                  onClick={() => setBuyNowPopUp(false)}
                />
                <Button
                  label={"Book without location"}
                  onClick={HandleBuyNow}
                />
              </div>
              <section className="flex justify-center items-center w-full">
                <div className="w-1/2">
                  <MapInput />
                </div>
                <div>
                  <form className="w-full flex flex-col justify-center items-center px-5 py-2">
                    <InputBox
                      LabelName="Street"
                      Placeholder="Enter street address"
                      Name="street"
                      Value={user?.[0]?.defaultAddress?.street}
                    />
                    <InputBox
                      LabelName="City"
                      Placeholder="Enter city"
                      Name="city"
                      Value={user?.[0]?.defaultAddress?.city}
                    />
                    <InputBox
                      LabelName="State"
                      Placeholder="Enter state"
                      Name="state"
                      Value={user?.[0]?.defaultAddress?.state}
                    />
                    <InputBox
                      LabelName="Country"
                      Placeholder="Enter country"
                      Name="country"
                      Value={user?.[0]?.defaultAddress?.country}
                    />
                    <InputBox
                      LabelName="Postal Code"
                      Placeholder="Enter postal code"
                      Name="postalCode"
                      Value={user?.[0]?.defaultAddress?.postalCode}
                    />
                  </form>
                </div>
              </section>
              <Button label={"Add Location and proceed"} />
            </div>
          </motion.div>
        )}
        {addressPopUp && (
          <div className="fixed top-0 left-0 py-5 w-full h-screen overflow-scroll bg-neutral-200 flex justify-center items-center">
            <div className="flex lg:flex-row flex-col flex-wrap justify-start items-center ">
              {user?.[0]?.address?.map((address, index) => (
                <div
                  key={address._id}
                  className="gap-5 flex justify-center items-center flex-row flex-wrap w-full lg:w-fit"
                >
                  <span className="shadow m-1 py-3 px-2 rounded-xl bg-neutral-200 w-full lg:w-fit">
                    <li className=" font-semibold list-none">
                      Street:{" "}
                      <span className="font-normal  ">
                        {truncateString(address?.street || "Not available")}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      City:{" "}
                      <span className="font-normal  ">
                        {address?.city || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Country:{" "}
                      <span className="font-normal  ">
                        {address?.country || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Postal Code:{" "}
                      <span className="font-normal  ">
                        {address?.postalCode || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      State:{" "}
                      <span className="font-normal  ">
                        {address?.state || "Not available"}
                      </span>
                    </li>
                    <div className="flex justify-evenly items-center gap-5 pt-2">
                      <button
                        className="flex justify-center items-center gap-2 hover:text-red-500 "
                        onClick={() => makeDefaultAddress(address?._id)}
                      >
                        <Check className="h-4 w-4 border-black border rounded-full" />
                        <span>Mark as Default</span>
                      </button>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CurrentProduct);
