import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DemoImageBanner } from "../../Constants/DemoImages";
import { FetchData } from "../../Utility/FetchFromApi";
import { Card } from "../../Components/ProductCard";
import { Link } from "react-router";
import { ThreeProductGrid } from "../../Components/Product-Grid";
import { truncateString } from "../../Utility/Utility-functions";
import { useSelector } from "react-redux";
import { toggleProductAvailability } from "../../Utility/Slice/UserInfoSlice";
import { useDispatch } from "react-redux";
import LoadingUI from "../../Components/Loading";
import { FilterByPincode } from "../../Utility/FilterByPincode";
import { PinCodeData } from "../../Constants/PinCodeData.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import oops from "../../assets/Oops.png";

const Home = ({ startLoading, stopLoading }) => {
  const scrollRefs = useRef([]);
  const scrollContainer = useRef(null);
  const [products, setProducts] = useState([]);
  // const scrollContainer = useRef(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { promotions, status } = useSelector((store) => store.PromotionList);
  const user = useSelector((store) => store.UserInfo.user);
  const userPostalCode = user[0]?.defaultAddress?.postalCode;
  const dispatch = useDispatch();
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const shuffleProduct = shuffleArray(products);
  // const [userCity, setUserCity] = useState(null);
  const [productsAvailableForUser, setProductsAvailableForUser] =
    useState(false);

  // useEffect(() => {
  //   if (user && user[0]?.address) {
  //     setUserCity(user[0]?.address[0]?.city);
  //   }
  // }, [user]);

  const arrayOfGridItems = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-products", "get");
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

        setProducts(filtered);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };

    const fetchAllCategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
          "get"
        );
        // console.log(response);

        if (response.data.success) {
          const categoriesData = response.data.data.categories;
          setCategories(categoriesData);

          // Extract subcategories
          const allSubcategories = categoriesData.flatMap(
            (category) => category.subcategories
          );
          setSubcategories(allSubcategories);
        } else {
          setError("Failed to load categories.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories.");
      } finally {
        stopLoading();
      }
    };

    fetchAllCategories();
    fetchProducts();
  }, [user]);

  // useEffect(() => {
  //   // if (!userCity) return;

  //   const fetchProducts = async () => {
  //     try {
  //       startLoading();
  //       const response = await FetchData("products/get-all-products", "get", {
  //         userCity,
  //       });
  //       // console.log(response.data.data);
  //       if (response.data.data.total !== 0) {
  //         setProducts(response.data.data.products);
  //         setProductsAvailableForUser(true);
  //         dispatch(toggleProductAvailability(true));
  //       } else {
  //         setProductsAvailableForUser(false);
  //         dispatch(toggleProductAvailability(false));
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to fetch products.");
  //     } finally {
  //       stopLoading();
  //     }
  //   };
  //   fetchProducts();
  // }, [user]);
  // }, [user, userCity]);

  const suggestedItems = products && products.slice(0, 4);
  const recommendation = shuffleProduct && shuffleProduct.slice(6, 10);
  const topSelection = shuffleProduct && shuffleProduct.slice(5, 8);
  const youMayLike = shuffleProduct && shuffleProduct.slice(7, 11);

  arrayOfGridItems.push(
    { products: suggestedItems, title: "Suggested Products" },
    { products: recommendation, title: "Recommended Products" },
    { products: youMayLike, title: "You May Like" },
    { products: topSelection, title: "Top Selection" }
  );
  const FamousSubcategory = [...subcategories].reverse();

  const ProductCarousel = () => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-700 text-white rounded-full p-2 z-10 hover:bg-red-600"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Product Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 max-w-full no-scrollbar scroll-smooth"
        >
          {shuffleProduct?.map((product) => (
            <Card
              Image={product?.images?.[0]?.url}
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

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 text-white rounded-full p-2 z-10 hover:bg-red-600"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const BannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === DemoImageBanner.length - 1 ? 0 : prevIndex + 1
      );
    };

    const prevImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? DemoImageBanner.length - 1 : prevIndex - 1
      );
    };

    useEffect(() => {
      const intervalId = setInterval(nextImage, 2000);
      return () => clearInterval(intervalId);
    }, []);

    return (
      <div className="relative w-full lg:h-96 h-64 mx-auto overflow-hidden rounded-lg">
        <div
          className=" sm:h-60 w-screen h-[44%] transition-transform duration-500 ease-in-out flex object-center  "
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* {console.log(promotions)} */}
          {status === "succeeded" &&
            promotions.map((promo, index) => {
              // console.log(promo);
              return (
                <img
                  key={promo?._id}
                  src={promo?.images?.url.lg}
                  alt={`Slide ${promo?._id}`}
                  className="min-w-full min-h-[44vh] "
                />
              );
            })}
        </div>
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &#8249;
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &#8250;
        </button>
      </div>
    );
  };

  return categories.length === 0 ? (
    startLoading()
  ) : (
    <div className="mx-auto py-4 lg:px-10">
      {/* {user && productsAvailableForUser === false && (
      // {user && userCity && productsAvailableForUser === false && (
        <div className="w-full h-10 bg-red-500 text-white">
          <h3 className="text-center">
            Limited Products are available at your location...
          </h3>
        </div>
      )} */}

      <div className="flex justify-start items-center gap-1 w-full overflow-x-scroll p-5 no-scrollbar">
        {FamousSubcategory.map((subcategory) => (
          <motion.div
            key={subcategory._id}
            whileHover={{ scale: 1, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
              to={`/all-products/${subcategory?.category._id}/${subcategory._id}/${subcategory?.category.title}/${subcategory.title}`}
              className="w-24 flex flex-col justify-center items-center"
            >
              <motion.div
                className="w-16 h-16 overflow-hidden rounded-full drop-shadow-xl border-4 border-gray-100"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <img
                  src={subcategory.image.url}
                  alt={subcategory.title}
                  className="w-full h-full"
                />
              </motion.div>
              <motion.span
                className="text-sm truncate mt-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {truncateString(subcategory.title, 10)}
              </motion.span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        <BannerSlider />
      </motion.div> */}

      {/* {error && (
        <div className="bg-red-500 text-white p-4 rounded">{error}</div>
      )} */}

      <div className="lg:h-[35vw] h-fit w-full p-2 lg:p-5  flex flex-col md:flex-row lg:flex-row lg:gap-10 gap-2 lg:overflow-x-auto md:overflow-x-auto flex-nowrap whitespace-nowrap  scroll-smooth justify-start items-center">
        {arrayOfGridItems.map((item, index) => (
          <div key={index} className="flex-none w-fit">
            <ThreeProductGrid products={item.products} heading={item.title} />
          </div>
        ))}
      </div>

      <div className="lg:mx-1 mx-2 my-10">
        <h1 className="w-full text-center uppercase lg:text-2xl tracking-widest lg:mb-5 mb-2">
          Shop by category
        </h1>

        {categories.map((category, index) => {
          const scrollLeft = () => {
            const current = scrollRefs.current[index];
            if (current) {
              current.scrollBy({
                left: -300,
                behavior: "smooth",
              });
            }
          };

          const scrollRight = () => {
            const current = scrollRefs.current[index];
            if (current) {
              current.scrollBy({
                left: 300,
                behavior: "smooth",
              });
            }
          };

          const categoryProducts = products.filter(
            (product) => product.category?._id === category._id
          );

          return (
            <motion.section
              key={category._id}
              className="lg:mb-10 mb-6 relative bg-neutral-200 px-5 py-5 rounded-xl shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">{category.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={scrollLeft}
                    className="bg-[#fe4343af] text-white px-3 py-1 rounded-full shadow hover:bg-[#FE4343] hover:text-black/50 font-extrabold duration-300 ease-in-out"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={scrollRight}
                    className="bg-[#fe4343af] text-white px-3 py-1 rounded-full shadow hover:bg-[#FE4343] hover:text-black/50 font-extrabold duration-300 ease-in-out"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div
                ref={(el) => (scrollRefs.current[index] = el)}
                className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-4 py-2 px-1 justify-start items-start scroll-smooth"
              >
                {categoryProducts.length > 0 ? (
                  categoryProducts.map((product) => (
                    <Card
                      Image={product.images?.[0]?.url}
                      key={product?._id}
                      ProductName={product?.name}
                      CurrentPrice={product.price.sellingPrice}
                      Mrp={product.price.MRP}
                      Rating={product.Rating}
                      Offer={product.off}
                      Description={product.description}
                      productId={product._id}
                      Discount={product.price.discount}
                      Stock={product.stockQuantity}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm px-2 w-full flex justify-center items-center gap-5">
                    <span className="hidden lg:flex">
                      <img src={oops} className="w-56" />
                    </span>
                    <strong className="text-sm lg:text-xl text-nowrap">
                      Oops !
                    </strong>
                    No products available under this category
                  </p>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>
      <div>
        <h1 className="w-full text-center uppercase lg:text-2xl tracking-widest lg:mb-5 mb-2">
          Shop More
        </h1>
        <ProductCarousel />
      </div>
    </div>
  );
};

export default LoadingUI(Home);
//  {
//    categories.map((category, index) => {
//      const scrollLeft = () => {
//        if (scrollContainer.current) {
//          scrollContainer.current.scrollBy({
//            left: -200,
//            behavior: "smooth",
//          });
//        }
//      };

//      const scrollRight = () => {
//        if (scrollContainer.current) {
//          scrollContainer.current.scrollBy({
//            left: 200,
//            behavior: "smooth",
//          });
//        }
//      };

//      return (
//        <motion.section
//          key={category._id} // Use unique id for key
//          className="lg:mb-10 mb-2"
//          initial={{ opacity: 0, y: 50 }}
//          animate={{ opacity: 1, y: 0 }}
//          transition={{ duration: 0.5, delay: index * 0.2 }}
//        >
//          {/* Category Title */}
//          <div className="flex justify-between items-center">
//            <h2 className="text-lg font-bold">{category.title}</h2>
//            <div className="flex gap-2">
//              <button
//                onClick={scrollLeft}
//                className="bg-[#fe4343af] text-white px-3 py-1 rounded-full shadow hover:bg-[#FE4343] hover:text-black/50 font-extrabold duration-300 ease-in-out"
//              >
//                &#8249;
//              </button>
//              <button
//                onClick={scrollRight}
//                className="bg-[#fe4343af] text-white px-3 py-1 rounded-full shadow hover:bg-[#FE4343] hover:text-black/50 font-extrabold duration-300 ease-in-out"
//              >
//                &#8250;
//              </button>
//            </div>
//          </div>

//          {/* Subcategories */}
//          <div
//            ref={scrollContainer}
//            className="flex overflow-x-auto overflow-y-hidden scrollbar-hide lg:gap-4 gap-2 py-2 px-1 justify-start items-start "
//          >
//            {category.subcategories.length > 0 ? (
//              category.subcategories.map((item) => (
//                <Link
//                  to={`/all-products/${category._id}/${item._id}/${category.title}/${item.title}`}
//                  key={item._id}
//                >
//                  <motion.div
//                    className="flex-none border border-gray-200 bg-white rounded-lg p-2 text-center shadow-md hover:shadow-lg w-48 h-fit "
//                    whileHover={{ scale: 1.05 }}
//                    whileInView={{ opacity: 1, x: 0 }}
//                    initial={{ opacity: 0, x: -100 }}
//                    transition={{ duration: 0.5 }}
//                  >
//                    <div className="object-fill h-24 bg-white rounded-md mb-2 flex justify-center items-center overflow-hidden">
//                      <img
//                        src={item.image?.url}
//                        alt={item.title}
//                        className="object-fill"
//                      />
//                    </div>
//                    <p className="text-sm ">{item.title}</p>
//                  </motion.div>
//                </Link>
//              ))
//            ) : (
//              <p className="text-gray-500">No subcategories available</p>
//            )}
//          </div>
//        </motion.section>
//      );
//    });
//  }
