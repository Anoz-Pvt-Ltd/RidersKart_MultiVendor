import React from "react";

const ProductCard = ({ ProductName, CurrentPrice, Mrp, Rating, Offer }) => {
  return (
    <div className="whiteSoftBG shadow-md hover:shadow-lg h-auto w-full sm:w-80 md:w-72 lg:w-80 overflow-hidden rounded-lg hover:scale-105 duration-300 ease-in-out">
      <div className="text-2xl h-2/3 p-2">No Image Found</div>
      <div className="h-1/3 px-4 py-3 gap-2 flex flex-col">
        <h1 className="text-xl sm:text-2xl font-semibold">{ProductName}</h1>
        <div className="flex w-full justify-start items-center gap-4 sm:gap-10">
          <h1 className="text-lg sm:text-xl">₹ {CurrentPrice}</h1>
          <h1 className="text-sm sm:text-base line-through text-gray-500">
            {Mrp}
          </h1>
        </div>
        <div className="flex justify-start items-center w-full gap-4 sm:gap-10 mt-2">
          <h1 className="text-sm sm:text-base">{Rating}</h1>
          <h1 className="text-sm sm:text-base text-green-600">{Offer}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
