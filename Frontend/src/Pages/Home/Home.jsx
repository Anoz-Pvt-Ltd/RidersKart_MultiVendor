import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DemoImageBanner } from "../../Constants/DemoImages";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import { Link } from "react-router";
import { categories } from "../../Constants/Home/Home.Constants";
// import mobile_gif from "../../assets/Home/mobile_gif.gif";
// import laptop_gif from "../../assets/Home/laptop_gif.gif";

const Home = () => {
  // const categories = [
  //   {
  //     title: "Electronics",
  //     items: [
  //       {
  //         name: "Mobile Phones",
  //         photo: "https://example.com/photo/cameras.photo",
  //       },
  //       { name: "Laptops", photo: "https://example.com/photo/cameras.photo" },
  //       { name: "Cameras", photo: "https://example.com/photo/cameras.photo" },
  //       {
  //         name: "Headphones",
  //         photo: "https://example.com/photo/headphones.photo",
  //       },
  //       {
  //         name: "Smartwatches",
  //         photo: "https://example.com/photo/smartwatches.photo",
  //       },
  //       {
  //         name: "Gaming Consoles",
  //         photo: "https://example.com/photo/gaming-consoles.photo",
  //       },
  //       {
  //         name: "Accessories",
  //         photo: "https://example.com/photo/accessories.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Clothing",
  //     items: [
  //       {
  //         name: "Men's Clothing",
  //         photo: "https://example.com/photo/mens-clothing.photo",
  //       },
  //       {
  //         name: "Women's Clothing",
  //         photo: "https://example.com/photo/womens-clothing.photo",
  //       },
  //       {
  //         name: "Kids' Clothing",
  //         photo: "https://example.com/photo/kids-clothing.photo",
  //       },
  //       { name: "Footwear", photo: "https://example.com/photo/footwear.photo" },
  //       {
  //         name: "Winter Wear",
  //         photo: "https://example.com/photo/winter-wear.photo",
  //       },
  //       {
  //         name: "Activewear",
  //         photo: "https://example.com/photo/activewear.photo",
  //       },
  //       {
  //         name: "Accessories",
  //         photo: "https://example.com/photo/clothing-accessories.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Home & Kitchen",
  //     items: [
  //       {
  //         name: "Furniture",
  //         photo: "https://example.com/photo/furniture.photo",
  //       },
  //       {
  //         name: "Kitchen Appliances",
  //         photo: "https://example.com/photo/kitchen-appliances.photo",
  //       },
  //       { name: "Cookware", photo: "https://example.com/photo/cookware.photo" },
  //       {
  //         name: "Home Decor",
  //         photo: "https://example.com/photo/home-decor.photo",
  //       },
  //       { name: "Bedding", photo: "https://example.com/photo/bedding.photo" },
  //       {
  //         name: "Storage Solutions",
  //         photo: "https://example.com/photo/storage-solutions.photo",
  //       },
  //       {
  //         name: "Cleaning Supplies",
  //         photo: "https://example.com/photo/cleaning-supplies.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Beauty",
  //     items: [
  //       { name: "Makeup", photo: "https://example.com/photo/makeup.photo" },
  //       { name: "Skincare", photo: "https://example.com/photo/skincare.photo" },
  //       {
  //         name: "Hair Care",
  //         photo: "https://example.com/photo/hair-care.photo",
  //       },
  //       { name: "Perfumes", photo: "https://example.com/photo/perfumes.photo" },
  //       {
  //         name: "Bath & Body",
  //         photo: "https://example.com/photo/bath-body.photo",
  //       },
  //       {
  //         name: "Nail Care",
  //         photo: "https://example.com/photo/nail-care.photo",
  //       },
  //       {
  //         name: "Tools & Accessories",
  //         photo: "https://example.com/photo/beauty-tools.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Health",
  //     items: [
  //       {
  //         name: "Supplements",
  //         photo: "https://example.com/photo/supplements.photo",
  //       },
  //       {
  //         name: "Fitness Equipment",
  //         photo: "https://example.com/photo/fitness-equipment.photo",
  //       },
  //       {
  //         name: "Healthcare Devices",
  //         photo: "https://example.com/photo/healthcare-devices.photo",
  //       },
  //       { name: "Vitamins", photo: "https://example.com/photo/vitamins.photo" },
  //       {
  //         name: "Personal Care",
  //         photo: "https://example.com/photo/personal-care.photo",
  //       },
  //       {
  //         name: "First Aid",
  //         photo: "https://example.com/photo/first-aid.photo",
  //       },
  //       {
  //         name: "Hygiene Products",
  //         photo: "https://example.com/photo/hygiene-products.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Books",
  //     items: [
  //       {
  //         name: "Fiction",
  //         photo: "https://example.com/photo/fiction-books.photo",
  //       },
  //       {
  //         name: "Non-Fiction",
  //         photo: "https://example.com/photo/non-fiction-books.photo",
  //       },
  //       {
  //         name: "Children's Books",
  //         photo: "https://example.com/photo/childrens-books.photo",
  //       },
  //       {
  //         name: "Educational",
  //         photo: "https://example.com/photo/educational-books.photo",
  //       },
  //       { name: "Comics", photo: "https://example.com/photo/comics.photo" },
  //       {
  //         name: "Biographies",
  //         photo: "https://example.com/photo/biographies.photo",
  //       },
  //       {
  //         name: "Self-Help",
  //         photo: "https://example.com/photo/self-help-books.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Toys",
  //     items: [
  //       {
  //         name: "Action Figures",
  //         photo: "https://example.com/photo/action-figures.photo",
  //       },
  //       { name: "Puzzles", photo: "https://example.com/photo/puzzles.photo" },
  //       {
  //         name: "Educational Toys",
  //         photo: "https://example.com/photo/educational-toys.photo",
  //       },
  //       { name: "Dolls", photo: "https://example.com/photo/dolls.photo" },
  //       {
  //         name: "Outdoor Toys",
  //         photo: "https://example.com/photo/outdoor-toys.photo",
  //       },
  //       {
  //         name: "Board Games",
  //         photo: "https://example.com/photo/board-games.photo",
  //       },
  //       { name: "RC Toys", photo: "https://example.com/photo/rc-toys.photo" },
  //     ],
  //   },
  //   {
  //     title: "Sports",
  //     items: [
  //       {
  //         name: "Cricket Gear",
  //         photo: "https://example.com/photo/cricket-gear.photo",
  //       },
  //       {
  //         name: "Football Equipment",
  //         photo: "https://example.com/photo/football-equipment.photo",
  //       },
  //       { name: "Cycling", photo: "https://example.com/photo/cycling.photo" },
  //       {
  //         name: "Gym Essentials",
  //         photo: "https://example.com/photo/gym-essentials.photo",
  //       },
  //       {
  //         name: "Outdoor Sports",
  //         photo: "https://example.com/photo/outdoor-sports.photo",
  //       },
  //       {
  //         name: "Swimming Gear",
  //         photo: "https://example.com/photo/swimming-gear.photo",
  //       },
  //       {
  //         name: "Tennis Accessories",
  //         photo: "https://example.com/photo/tennis-accessories.photo",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Automotive",
  //     items: [
  //       {
  //         name: "Car Accessories",
  //         photo: "https://example.com/photo/car-accessories.photo",
  //       },
  //       {
  //         name: "Bike Accessories",
  //         photo: "https://example.com/photo/bike-accessories.photo",
  //       },
  //       {
  //         name: "Oils & Lubricants",
  //         photo: "https://example.com/photo/oils-lubricants.photo",
  //       },
  //       { name: "Car Care", photo: "https://example.com/photo/car-care.photo" },
  //       { name: "Tools", photo: "https://example.com/photo/tools.photo" },
  //       { name: "Tires", photo: "https://example.com/photo/tires.photo" },
  //       {
  //         name: "Navigation Systems",
  //         photo: "https://example.com/photo/navigation-systems.photo",
  //       },
  //     ],
  //   },
  // ];

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

      {/* <div className="flex gap-4 bg-transparent justify-center items-center overflow-x-auto p-5 max-w-full">
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
      </div> */}

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
                className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-4 h-60 justify-center items-center py-20"
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
    </div>
  );
};

export default Home;
