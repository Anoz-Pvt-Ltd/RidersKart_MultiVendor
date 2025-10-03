import React, { useState } from "react";
import Login from "../Login/Login";
import VendorRegistrationForm from "../Registration/Registration";
import logo from "../../assets/Logo.png";
import background from "../../assets/HomeBackground.jpg";
import Button from "../../components/Button";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import { AnimatePresence, motion } from "framer-motion";
import VendorHighlights from "./HighLights";
import VendorFAQ from "./FAQS";

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [openModel, setIsOpenModel] = useState(false);
  return (
    <div className="bg-neutral-100">
      <div className="absolute h-screen w-screen object-fill overflow-hidden hidden lg:block">
        <img src={background} className="opacity-50" />
      </div>
      <div className="flex flex-col justify-center items-center lg:gap-20 gap-10 px-2 py-20 relative">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="uppercase lg:text-4xl text-2xl text-center flex flex-col justify-center items-center lg:gap-5 tracking-widest font-bold"
        >
          grow your{" "}
          <motion.span
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            business with
          </motion.span>
          <span>
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-2xl p-2 rounded-xl select-none w-fit tracking-widest lg:h-96 h-fit overflow-hidden font-light"
            >
              Riders Kart
              <span className="p-1 rounded-xl">
                <img src={logo} className="lg:w-96 w-72" />
              </span>
            </motion.h1>
          </span>
        </motion.h1>
        <div className="gap-20 flex justify-center items-center ">
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button label="Login" onClick={() => setShowPopup2(true)} />
          </motion.p>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Button label="Register" onClick={() => setShowPopup(true)} />
          </motion.p>
        </div>
        <VendorHighlights />
        <VendorFAQ />
      </div>
      <AnimatePresence>
        {showPopup2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="login flex lg:justify-center lg:items-center items-start justify-start fixed top-0 left-0 h-screen w-full bg-neutral-200"
          >
            <Login
              openForgetPassword={() => setIsOpenModel(true)}
              onCancel={() => setShowPopup2(false)}
            />
            {openModel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-screen w-full flex justify-center items-center bg-neutral-200"
              >
                <ForgetPassword cancel={() => window.location.reload()} />
              </motion.div>
            )}
          </motion.div>
        )}
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 flex lg:justify-center lg:items-center h-screen w-screen bg-opacity-90 bg-neutral-500 overflow-scroll"
          >
            <div className="flex flex-col lg:justify-center lg:items-center lg:gap-10 lg:w-3/4">
              <Button
                label={"Close"}
                className={"hover:bg-red-500 hidden lg:block"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />
              <Button
                label={"Cancel "}
                className={"hover:bg-red-500 lg:hidden block"}
                onClick={() => {
                  setShowPopup(false);
                }}
              />
              <VendorRegistrationForm
                onClose={() => {
                  setShowPopup(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
// import React, { useState } from "react";
// import Login from "../Login/Login";
// import VendorRegistrationForm from "../Registration/Registration";
// import background from "../../assets/HomeBackground.jpg";
// import Button from "../../components/Button";
// import ForgetPassword from "../ForgetPassword/ForgetPassword";

// const Hero = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [openModel, setIsOpenModel] = useState(false);
//   return (
//     <div className="">
//       <div className="absolute h-screen w-screen object-fill overflow-hidden hidden lg:block">
//         <img src={background} />
//       </div>
//       <div className="lg:flex justify-center items-center text-black lg:text-4xl text-base font-bold lg:absolute relative backdrop-blur lg:h-20 w-full">
//         <h1 className="w-full text-center">
//           Welcome to Rider's Kart Seller Hub
//         </h1>
//       </div>

//       <section className="flex lg:flex-row flex-col">
//         {/* Login Component */}
//         <div className="login lg:w-1/2 lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
//           <Login openForgetPassword={() => setIsOpenModel(true)} />
//         </div>
//         {/* register Component */}
//         <div className="register lg:w-1/2 w-full lg:h-screen flex lg:justify-center lg:items-center items-start justify-start relative">
//           <div className="flex flex-col justify-center items-start gap-10 lg:px-5 lg:py-10 lg:mr-5 p-2 shadow-xl rounded-xl text-black backdrop-blur-sm">
//             <h1 className="lg:text-2xl text-base font-bold lg:my-8">
//               New to Rider's Kart Ecom service<br></br>Register your self with
//               simple steps and <br></br>Sell and grow your business online
//             </h1>
//             <Button
//               label={"Register Here"}
//               onClick={() => {
//                 setShowPopup(true);
//               }}
//               className={"lg:hidden block"}
//             />

//             <div className="max-w-3xl mx-auto px-6">
//               <ol className="list-decimal pl-5 space-y-4">
//                 <li className="text-base text-gray-800">
//                   Create your account and set up your online store.
//                 </li>
//                 <li className="text-base text-gray-800">
//                   Upload your products with detailed descriptions and images.
//                 </li>
//                 <li className="text-base text-gray-800">
//                   Set up payment methods and configure shipping options.
//                 </li>
//                 <li className="text-base text-gray-800">
//                   Launch your store and start promoting through social media and
//                   marketing campaigns.
//                 </li>
//                 <li className="text-base text-gray-800">
//                   Track your sales, orders, and customer feedback to grow your
//                   business.
//                 </li>
//               </ol>
//             </div>
//             <Button
//               label={"Register Here"}
//               onClick={() => {
//                 setShowPopup(true);
//               }}
//               className={"hidden lg:block"}
//             />
//           </div>
//         </div>
//         {showPopup && (
//           <div className="fixed top-0 left-0 flex lg:justify-center lg:items-center h-screen w-screen bg-opacity-90 bg-neutral-500 overflow-scroll">
//             <div className="flex flex-col lg:justify-center lg:items-center lg:gap-10 lg:w-3/4">
//               <Button
//                 label={"Close"}
//                 className={"hover:bg-red-500 hidden lg:block"}
//                 onClick={() => {
//                   setShowPopup(false);
//                 }}
//               />
//               <Button
//                 label={"Cancel "}
//                 className={"hover:bg-red-500 lg:hidden block"}
//                 onClick={() => {
//                   setShowPopup(false);
//                 }}
//               />
//               <VendorRegistrationForm
//                 onClose={() => {
//                   setShowPopup(false);
//                 }}
//               />
//             </div>
//           </div>
//         )}
//         {openModel && (
//           <div className="absolute top-0 left-0 h-screen w-full flex justify-center items-center bg-neutral-200">
//             <ForgetPassword />
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Hero;
