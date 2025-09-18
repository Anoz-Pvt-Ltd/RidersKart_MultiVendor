// import Image from "next/image";
import { Heart, Check, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import {
  truncateString,
  truncateNumber,
} from "../../Utility/Utility-functions";
import Button from "../../Components/Button";
import { useDispatch, useSelector } from "react-redux";
import { alertError, alertInfo, alertSuccess } from "../../Utility/Alert";
import { addCart } from "../../Utility/Slice/CartSlice";

export default function SearchPage() {
  const searchInput = useParams().searchData;
  const [searchedResponse, setSearchedResponse] = useState(null);
  const [sortOption, setSortOption] = useState("Relevance");
  const sortOptions = [
    { key: "Relevance", label: "Relevance" },
    { key: "Popularity", label: "Popularity" },
    { key: "PriceLowHigh", label: "Price -- Low to High" },
    { key: "PriceHighLow", label: "Price -- High to Low" },
    { key: "Newest", label: "Newest First" },
    { key: "Discount", label: "Discount" },
  ];

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await FetchData("products/search-product", "get", {
          query: searchInput,
        });
        console.log(response);
        setSearchedResponse(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    handleSearch();
  }, [searchInput]);

  const dispatch = useDispatch();
  const user = useSelector((store) => store.UserInfo.user[0]);
  const Navigate = useNavigate();
  const addProductToCart = async ({ productId }) => {
    try {
      // startLoading();
      const currentProduct = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      const response = await FetchData(
        `users/${user?._id}/${productId}/cart/add`,
        "post"
      );
      alertSuccess(response.data.message);
      dispatch(addCart(currentProduct.data.data));
      // dispatch(addProductToCart(productId));
    } catch (err) {
      if (!user) {
        Navigate("/login");
      }
      console.log(err);
      alertError(
        err.response?.data?.message ||
          "Please Login first!, Failed to add product to cart."
      );
    } finally {
      // stopLoading();
    }
  };

  const sortProducts = (products) => {
    if (!products) return [];

    let sorted = [...products];

    switch (sortOption) {
      case "PriceLowHigh":
        sorted.sort((a, b) => a.price.sellingPrice - b.price.sellingPrice);
        break;

      case "PriceHighLow":
        sorted.sort((a, b) => b.price.sellingPrice - a.price.sellingPrice);
        break;

      case "Newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "Discount":
        sorted.sort((a, b) => b.price.discount - a.price.discount);
        break;

      case "Popularity":
        sorted.sort(
          (a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0)
        );
        break;

      default: // Relevance
        break;
    }

    return sorted;
  };

  // const HandleBuyNow = async ({ productId, MRP, sellingPrice }) => {
  //   if (user > 0) {
  //     try {
  //       startLoading();

  //       // Ensure all required fields are included
  //       const response = await FetchData(`orders/create-order`, "post", {
  //         userId: user._id,
  //         products: [{ product: productId, quantity: 1, price: MRP }],
  //         // shippingAddress: addresses[selectedAddress],
  //         totalAmount: sellingPrice,
  //       });
  //       // console.log(response);

  //       if (response.data.success) {
  //         // alert("Order placed successfully!");
  //         Navigate(`/checkout/${productId}/${response.data.data._id}`);
  //       }
  //     } catch (err) {
  //       // console.log(err);
  //       alertError(parseErrorMessage(err.response.data));
  //     } finally {
  //       stopLoading();
  //     }
  //   } else {
  //     alertInfo("Please Login first!");
  //     Navigate("/login");
  //   }
  // };

  //  product card UI
  const productCard = ({
    id,
    image = "?",
    name = "?",
    ratingNumber = { rating: 0, numberOfRating: 0, numberOfReviews: 0 },
    specifications = ["?"],
    price = 0,
    originalPrice = 0,
    discount = 0,
    bankOffer = "?",
  }) => {
    return (
      <Link
        id={id}
        to={`/current-product/${id}`}
        className="flex flex-col md:flex-row gap-4 border-b pb-6 justify-center items-center"
      >
        <div className="flex justify-start items-center w-full gap-5">
          <div className="flex items-center justify-center w-28 h-28 lg:w-[200px] lg:h-[200px]">
            {/* <button className="absolute top-2 left-2 text-gray-400 hover:text-gray-600">
            <Heart className="w-6 h-6" />
          </button> */}
            <img
              src={image}
              // width={200}
              // height={200}
              className="object-contain "
            />
          </div>
          <div className="flex-grow">
            <h2 className="lg:text-lg font-medium">
              {truncateString(name, 20)}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                {ratingNumber.rating} ★
              </span>
              <span className="text-gray-600 text-sm">
                {ratingNumber.numberOfRating} Ratings &{" "}
                {ratingNumber.numberOfReviews} Reviews
              </span>
            </div>
            <ul className="lg:hidden block ">
              {specifications.map((spec, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <span>{truncateString(spec, 70)}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-3 space-y-1 hidden lg:block md:block">
              {specifications.map((spec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>{truncateString(spec, 150)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="min-w-[180px] lg:text-right flex flex-wrap lg:flex-nowrap lg:flex-col gap-2">
          <div className="flex lg:flex-col flex-row lg:justify-center justify-evenly items-center w-full">
            <div className="lg:text-2xl font-bold">₹{price}</div>
            <div className="flex items-center justify-center lg:justify-end gap-2 text-sm">
              <span className="text-gray-500 line-through">
                ₹{originalPrice}
              </span>
              <span className="bg-green-300 px-2 py-1 rounded-xl">
                {discount}% off
              </span>
            </div>
            <div className="text-sm lg:mt-1">
              {price > 500 ? "Free delivery" : "Delivered for 40 only"}
            </div>
          </div>
          <div className="w-full justify-evenly items-center flex ">
            <Button
              label={
                <h1 className="flex justify-center items-center gap-5">
                  Add to Cart <ShoppingCart />
                </h1>
              }
              className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-black `}
              onClick={() => addProductToCart({ productId: id })}
            />
            {/* <Button
              label={
                <h1 className="flex justify-center items-center gap-5">
                  Byu Now <ShoppingCart />
                </h1>
              }
              className={`bg-[#ff9f00] hover:bg-[#ffbb4e] text-black `}
              onClick={() =>
                HandleBuyNow({
                  productId: id,
                  MRP: originalPrice,
                  sellingPrice: price,
                })
              }
            /> */}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Search Results */}
      <h1 className="text-xl font-medium mb-4">
        Showing {searchedResponse?.totalResults ?? 0} results for "{searchInput}
        "
      </h1>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-4 mb-10">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setSortOption(option.key)}
            className={`pb-1 font-medium ${
              sortOption === option.key
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-600 border-b-2 hover:text-red-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Product Listings */}
      {console.log(searchedResponse)}
      <div className="space-y-6">
        {searchedResponse &&
          sortProducts(searchedResponse.products).map((product) => {
            const ratingsArray = product.ratings || [];
            const numberOfRating = ratingsArray.length;
            const totalRating = ratingsArray.reduce(
              (sum, r) => sum + r.rating,
              0
            );
            const avgRating =
              numberOfRating > 0
                ? (totalRating / numberOfRating).toFixed(1)
                : 0;

            return productCard({
              id: product._id,
              name: product.name,
              image: product.images[0]?.url,
              discount: product.price.discount,
              originalPrice: product.price.MRP,
              price: product.price.sellingPrice,
              specifications: [product.specifications.details],
              ratingNumber: {
                rating: avgRating,
                numberOfRating: numberOfRating,
                numberOfReviews: numberOfRating,
              },
            });
          })}
      </div>
    </div>
  );
}
