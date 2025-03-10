import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DemoImageBanner } from "../../Constants/DemoImages";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import { Link } from "react-router";
import { categories } from "../../Constants/Home/Home.Constants";
import LoadingUI from "../../Components/Loading";

const Home = ({ startLoading, stopLoading }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  // console.log(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-product", "get");
        console.log(response);
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
    fetchProducts();
  }, []);

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
      const intervalId = setInterval(nextImage, 3000);
      return () => clearInterval(intervalId);
    }, []);

    return (
      <div className="relative w-full lg:h-96 h-64 mx-auto overflow-hidden rounded-lg lg:mb-20">
        <div
          className="transition-transform duration-500 ease-in-out flex items-top object-center"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {DemoImageBanner.map((image) => (
            <img
              key={image.id}
              src={image.src}
              alt={`Slide ${image.id}`}
              className="w-full object-center"
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
    <div className="container mx-auto p-4">
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

      <div className="">
        {categories.map((category, index) => {
          const scrollContainer = useRef(null);

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
              key={index}
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
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

              <div
                ref={scrollContainer}
                className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-4 lg:h-60 justify-start items-start lg:py-20 "
              >
                {category.items.map((item, idx) => (
                  <Link
                    to={`/all-products/${category.title}/${item.name}`}
                    key={idx}
                  >
                    <motion.div
                      className="flex-none border border-gray-200 rounded-lg p-2 text-center shadow-md hover:shadow-lg w-48 h-fit"
                      whileHover={{ scale: 1.05 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="h-24 bg-gray-100 rounded-md mb-2 object-center flex justify-center items-center p-10 overflow-hidden">
                        <img src={item.photo} alt={item.name} />
                      </div>
                      <p className="text-sm">{item.name}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
      <div className="flex gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 max-w-full">
        {products?.map((product) => (
          <ProductCard
            Image={product?.images[0]?.url}
            key={product?._id}
            ProductName={product?.name}
            CurrentPrice={product?.price}
            Mrp={product?.price}
            Rating={product?.rating || "No rating"}
            Offer={"No offer"}
            Category={product?.category}
            StockQuantity={product?.stockQuantity}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(Home);
