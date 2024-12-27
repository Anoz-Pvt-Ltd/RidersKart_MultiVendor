import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DemoImageBanner } from "../../Constants/DemoImages";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";

const Home = () => {
  const categories = [
    {
      title: "Electronics",
      items: [
        "Mobile Phones",
        "Laptops",
        "Cameras",
        "Headphones",
        "Smartwatches",
        "Gaming Consoles",
        "Accessories",
      ],
    },
    {
      title: "Clothing",
      items: [
        "Men's Clothing",
        "Women's Clothing",
        "Kids' Clothing",
        "Footwear",
        "Winter Wear",
        "Activewear",
        "Accessories",
      ],
    },
    {
      title: "Home & Kitchen",
      items: [
        "Furniture",
        "Kitchen Appliances",
        "Cookware",
        "Home Decor",
        "Bedding",
        "Storage Solutions",
        "Cleaning Supplies",
      ],
    },
    {
      title: "Beauty",
      items: [
        "Makeup",
        "Skincare",
        "Hair Care",
        "Perfumes",
        "Bath & Body",
        "Nail Care",
        "Tools & Accessories",
      ],
    },
    {
      title: "Health",
      items: [
        "Supplements",
        "Fitness Equipment",
        "Healthcare Devices",
        "Vitamins",
        "Personal Care",
        "First Aid",
        "Hygiene Products",
      ],
    },
    {
      title: "Books",
      items: [
        "Fiction",
        "Non-Fiction",
        "Children's Books",
        "Educational",
        "Comics",
        "Biographies",
        "Self-Help",
      ],
    },
    {
      title: "Toys",
      items: [
        "Action Figures",
        "Puzzles",
        "Educational Toys",
        "Dolls",
        "Outdoor Toys",
        "Board Games",
        "RC Toys",
      ],
    },
    {
      title: "Sports",
      items: [
        "Cricket Gear",
        "Football Equipment",
        "Cycling",
        "Gym Essentials",
        "Outdoor Sports",
        "Swimming Gear",
        "Tennis Accessories",
      ],
    },
    {
      title: "Automotive",
      items: [
        "Car Accessories",
        "Bike Accessories",
        "Oils & Lubricants",
        "Car Care",
        "Tools",
        "Tires",
        "Navigation Systems",
      ],
    },
  ];

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await FetchData("products/get-all-product", "get");
      console.log(response);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Failed to load products.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
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
      <div className="relative w-full h-96 mx-auto overflow-hidden rounded-lg mb-20">
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
      <BannerSlider />

      {error && (
        <div className="bg-red-500 text-white p-4 rounded">{error}</div>
      )}

      <div className="flex gap-4 bg-transparent justify-center items-center overflow-x-auto p-5 max-w-full">
        {products.map((product) => (
          <ProductCard
            key={product?._id}
            ProductName={product?.name}
            CurrentPrice={product?.price}
            Mrp={product?.price} // Assuming the price is the same for now
            Rating={product?.rating || "No rating"}
            Offer={"No offer"} // If the offer isn't provided, adjust this as needed
            Category={product?.category}
            StockQuantity={product?.stockQuantity}
          />
        ))}
      </div>

      <div>
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
                className="flex overflow-x-auto scrollbar-hide gap-4 h-60 justify-center items-center py-20"
              >
                {category.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-none border border-gray-200 rounded-lg p-2 text-center shadow-md hover:shadow-lg w-48 h-fit"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="h-24 bg-gray-100 rounded-md mb-2"></div>
                    <p className="text-sm">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
