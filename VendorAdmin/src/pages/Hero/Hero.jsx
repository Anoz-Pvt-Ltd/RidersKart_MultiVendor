import React from "react";
import ProductSlider from "../../components/AllProducts";
import Button from "../../components/Button";

const Hero = () => {
  const vendor = {
    name: "Elite Electronics",
    contact: "+91 9876543210",
    email: "elite.electronics@example.com",
    location: "Bangalore, India",
    rating: 4.7,
    reviews: 156,
    products: [
      "Smartphone XYZ",
      "Wireless Earbuds",
      "Laptop ABC",
      "Smartwatch DEF",
      "Gaming Headset",
    ],
  };

  const VendorDetails = ({ vendor }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center underline underline-offset-4">
          Profile overview
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{vendor.name}</h1>
        <div className="text-gray-600 mb-4">
          <p className="font-semibold">
            Contact: <span className="font-normal">{vendor.contact}</span>
          </p>
          <p className="font-semibold">
            Email: <span className="font-normal">{vendor.email}</span>
          </p>
          <p className="font-semibold">
            Location: <span className="font-normal">{vendor.location}</span>
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ratings</h2>
          <p className="text-yellow-500 font-semibold">
            {vendor.rating} ★ ({vendor.reviews} reviews)
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Products Available
          </h2>
          <ul className="list-disc ml-5 text-gray-600">
            {vendor.products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div>
      <section className="flex justify-evenly items-center">
        <div className="w-1/2">
          <VendorDetails vendor={vendor} />
        </div>
        <Button label={"Edit your Profile"} />
        <Button label={"Upload New Product"} />
      </section>
      <section className="p-5">
        <h1 className="text-3xl w-full text-center font-semibold">
          Your recently added Products
        </h1>
        <ProductSlider />
      </section>
    </div>
  );
};

export default Hero;
