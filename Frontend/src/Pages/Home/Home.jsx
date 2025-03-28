import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DemoImageBanner } from "../../Constants/DemoImages";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import { Link } from "react-router";
// import { categories } from "../../Constants/Home/Home.Constants";
import LoadingUI from "../../Components/Loading";
import { ThreeProductGrid } from "../../Components/Product-Grid";
import { truncateString } from "../../Utility/Utility-functions";

const Home = ({ startLoading, stopLoading }) => {
  const scrollContainer = useRef(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const arrayOfGridItems = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-products", "get");
        // console.log(response);
        if (response.data.success) {
          setProducts(response.data.data.products);
        } else {
          setError("Failed to load products.");
        }
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
  }, []);

  // console.log(subcategories);

  const suggestedItems = products && products.slice(0, 3);
  const topSelection = products && products.slice(3, 6);
  const youMayLike = products && products.slice(6, 9);
  const recommendation = products && products.slice(6, 10);

  arrayOfGridItems.push(
    { products: suggestedItems, title: "Suggested Products" },
    { products: recommendation, title: "Recommended Products" },
    { products: youMayLike, title: "You May Like" },
    { products: topSelection, title: "Top Selection" }
  );
  const FamousSubcategory = subcategories.slice(0, 9);

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
          {DemoImageBanner.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Slide ${image.id}`}
              className="min-w-full min-h-[44vh] "
            />
          ))}
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

  return (
    <div className="container mx-auto py-4">
      <div className="lg:w-fit flex gap-10 p-5 lg:m-auto  w-full  overflow-x-auto flex-nowrap whitespace-nowrap no-scrollbar">
        {FamousSubcategory.map((subcategory) => (
          <div
            key={subcategory._id}
            className="w-24 flex flex-col justify-center items-center  "
          >
            <div className="w-16 h-16 overflow-hidden rounded-full drop-shadow-xl border-4 border-gray-100">
              <img
                src={subcategory.image.url}
                alt={subcategory.title}
                className="w-full h-full "
              />
            </div>
            <span className="text-sm">
              {truncateString(subcategory.title, 10)}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        <BannerSlider />
      </motion.div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded">{error}</div>
      )}

      <div className="lg:h-[35vw] h-fit w-full p-2 lg:p-5 my-10 lg:my-0 flex flex-col lg:flex-row gap-10 lg:overflow-x-auto flex-nowrap whitespace-nowrap  scroll-smooth no-scrollbar">
        {arrayOfGridItems.map((item, index) => (
          <div key={index} className="flex-none w-fit">
            <ThreeProductGrid products={item.products} heading={item.title} />
          </div>
        ))}
      </div>

      <div className="mx-10">
        {categories.map((category, index) => {
          const scrollLeft = () => {
            if (scrollContainer.current) {
              scrollContainer.current.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }
          };

          const scrollRight = () => {
            if (scrollContainer.current) {
              scrollContainer.current.scrollBy({
                left: 200,
                behavior: "smooth",
              });
            }
          };

          return (
            <motion.section
              key={category._id} // Use unique id for key
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Category Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{category.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={scrollLeft}
                    className="headerBg text-white px-3 py-1 rounded shadow hover:bg-purple-800"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={scrollRight}
                    className="headerBg text-white px-3 py-1 rounded shadow hover:bg-purple-800"
                  >
                    &#8250;
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              <div
                ref={scrollContainer}
                className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-4 py-2 px-1 justify-start items-start "
              >
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((item) => (
                    <Link
                      to={`/all-products/${category._id}/${item._id}/${category.title}/${item.title}`}
                      key={item._id}
                    >
                      <motion.div
                        className="flex-none border border-gray-200 bg-white rounded-lg p-2 text-center shadow-md hover:shadow-lg w-48 h-fit "
                        whileHover={{ scale: 1.05 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="object-fill h-24 bg-white rounded-md mb-2 flex justify-center items-center p-10 overflow-hidden">
                          <img
                            src={item.image?.url}
                            alt={item.title}
                            className="object-fill"
                          />
                        </div>
                        <p className="text-sm ">{item.title}</p>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available</p>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>

      <div className="flex gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 max-w-full no-scrollbar">
        {products?.map((product) => (
          <ProductCard
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
    </div>
  );
};

export default LoadingUI(Home);
