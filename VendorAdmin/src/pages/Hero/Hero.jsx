import React, { useState } from "react";
import Login from "../Login/Login";
import VendorRegistrationForm from "../Registration/Registration";
import background from "../../assets/HomeBackground.jpg";
import Button from "../../components/Button";

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="">
      <div className="absolute h-screen w-screen object-fill overflow-hidden">
        <img src={background} />
      </div>
      <div className="flex justify-center items-center text-black text-4xl font-bold font-sans absolute backdrop-blur h-20 w-full ">
        <h1>Welcome to Rider's Kart Vendor Hub</h1>
      </div>
      {/* Login Component */}
      <section className="flex">
        <div className=" lg:w-1/2 h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
          <Login />
        </div>
        <div className=" lg:w-1/2 h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
          <div className="flex flex-col justify-center items-start gap-10 px-5 py-10 mr-5 shadow-xl rounded-xl  text-black backdrop-blur-sm">
            <h1 className="text-2xl font-bold my-8">
              New to Rider's Kart Ecom service<br></br>Register your self with
              simple steps and <br></br>Sell and grow your business online
            </h1>

            <div className="max-w-3xl mx-auto px-6">
              <ol className="list-decimal pl-5 space-y-4">
                <li className="text-base text-gray-800">
                  Create your account and set up your online store.
                </li>
                <li className="text-base text-gray-800">
                  Upload your products with detailed descriptions and images.
                </li>
                <li className="text-base text-gray-800">
                  Set up payment methods and configure shipping options.
                </li>
                <li className="text-base text-gray-800">
                  Launch your store and start promoting through social media and
                  marketing campaigns.
                </li>
                <li className="text-base text-gray-800">
                  Track your sales, orders, and customer feedback to grow your
                  business.
                </li>
              </ol>
            </div>
            <Button
              label={"Register Here"}
              onClick={() => {
                setShowPopup(true);
              }}
            />
          </div>
          {/* <VendorRegistrationForm /> */}
        </div>
        {showPopup && (
          <div className="absolute top-0 left-0 flex justify-center items-center h-screen w-screen bg-opacity-90 bg-neutral-500">
            <div className="flex flex-col justify-center items-center gap-10 w-3/4">
              <Button
                label={"Close"}
                className={"hover:bg-red-500"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />
              <VendorRegistrationForm />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Hero;
