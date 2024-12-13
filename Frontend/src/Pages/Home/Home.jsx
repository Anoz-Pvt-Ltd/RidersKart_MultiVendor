import React, { useEffect, useState } from "react";
import ProductCategory from "./ProductCategory";
import { DemoImageBanner } from "../../Constants/DemoImages";

const Home = () => {
  const BannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === DemoImageBanner.length - 1 ? 0 : prevIndex + 1
      );
    };

    // Function to move to the previous image
    const prevImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? DemoImageBanner.length - 1 : prevIndex - 1
      );
    };

    // Auto slide every 3 seconds
    useEffect(() => {
      const intervalId = setInterval(nextImage, 3000);
      return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    return (
      <div className="relative w-full h-96 mx-auto overflow-hidden rounded-lg shadow-lg shadow-neutral-300">
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

        {/* Navigation Buttons */}
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
    <div className="px-10 flex flex-col justify-center gap-4">
      <ProductCategory />
      <BannerSlider />
    </div>
  );
};

export default Home;
