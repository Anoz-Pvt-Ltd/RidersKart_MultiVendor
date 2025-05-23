// import Image from "next/image";
import { Heart, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";

export default function SearchPage() {
  const searchInput = useParams().searchData;

  console.log(searchInput);

  const [searchedResponse, setSearchedResponse] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await FetchData("products/search-product", "get", {
          query: searchInput,
        });
        console.log(response);
        setSearchedResponse(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    handleSearch();
  }, [searchInput]);

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
      <Link id={id} className='flex flex-col md:flex-row gap-4 border-b pb-6'>
        <div className='relative min-w-[200px] flex items-center justify-center'>
          <button className='absolute top-2 left-2 text-gray-400 hover:text-gray-600'>
            <Heart className='w-6 h-6' />
          </button>
          <img
            src={image}
            width={200}
            height={200}
            className='object-contain'
          />
        </div>
        <div className='flex-grow'>
          <h2 className='text-lg font-medium'>{name}</h2>
          <div className='flex items-center gap-2 mt-1'>
            <span className='bg-green-600 text-white text-xs px-2 py-0.5 rounded'>
              {ratingNumber.rating} ★
            </span>
            <span className='text-gray-600 text-sm'>
              {ratingNumber.numberOfRating} Ratings &{" "}
              {ratingNumber.numberOfReviews} Reviews
            </span>
          </div>
          <ul className='mt-3 space-y-1'>
            {specifications.map((spec, index) => (
              <li key={index} className='flex items-start gap-2'>
                <span className='text-gray-400 min-w-4'>•</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='min-w-[180px] text-right'>
          <div className='text-2xl font-bold'>₹{price}</div>
          <div className='flex items-center justify-end gap-2 text-sm'>
            <span className='text-gray-500 line-through'>₹{originalPrice}</span>
            <span className='text-green-600 font-medium'>{discount}% off</span>
          </div>
          <div className='text-sm mt-1'>
            {price > 500 ? "Free delivery" : "Delivered for 40 only"}
          </div>
          <div className='text-sm mt-1'>{bankOffer}</div>
          <div className='flex items-center justify-end mt-2 gap-1'>
            <div className='bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-sm flex items-center'>
              <Check className='w-3 h-3 mr-1' /> Assured
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-4'>
      {/* Search Results */}
      <h1 className='text-xl font-medium mb-4'>
        Showing {searchedResponse.totalResults?? 0} results for "{searchInput}"
      </h1>

      {/* Sort Options */}
      <div className='flex flex-wrap items-center gap-4 mb-6 border-b pb-2'>
        <span className='font-medium'>Sort By</span>
        <div className='flex flex-wrap gap-4'>
          <button className='text-blue-500 border-b-2 border-blue-500 pb-1 font-medium'>
            Relevance
          </button>
          <button className='text-gray-600 hover:text-blue-500'>
            Popularity
          </button>
          <button className='text-gray-600 hover:text-blue-500'>
            Price -- Low to High
          </button>
          <button className='text-gray-600 hover:text-blue-500'>
            Price -- High to Low
          </button>
          <button className='text-gray-600 hover:text-blue-500'>
            Newest First
          </button>
          <button className='text-gray-600 hover:text-blue-500'>
            Discount
          </button>
        </div>
      </div>

      {/* Product Listings */}
      <div className='space-y-6'>
        {searchedResponse &&
          searchedResponse.products.map((product) => {
            return productCard({
              id: product._id,
              name: product.name,
              image: product.images[0].url,
              discount: product.price.discount,
              originalPrice: product.price.MRP,
              price: product.price.sellingPrice,
              specifications: [product.specifications.details],
            });
          })}
      </div>
    </div>
  );
}
