import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const handleNavigate = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="bg-black text-white  select-none z-50">
      <section className="Upper-part pt-10 flex justify-around phone:gap-10 flex-col lg:flex-row px-5 z-50">
        <div className="Logo-and-slogan border-b mb-5 h-fit">
          <h1 className="text-[2rem] tracking-widest font-serif">
            Rider's Kart
          </h1>
          <h3 className="lg:text-lg text-gray-300">Purchase anything,</h3>
          <h3 className="lg:text-lg text-gray-300">Anywhere,</h3>
          <h3 className="lg:text-lg text-gray-300">Anytime</h3>
        </div>
        <div className="Quick link   border-b mb-5 h-fit">
          <h1 className="text-xl underline-offset-4 underline">Quick Links </h1>
          <ul>
            <li className="small-footer-text">
              <Link>
                {/* <Link to={"#services"} onClick={handleNavigate}> */}{" "}
                Services
              </Link>
            </li>
            <li className="small-footer-text">
              <Link to={`https://postman.riderskart.in/`} target="_blank">
                Rider's Kart Postman
              </Link>
            </li>
          </ul>
        </div>
        <div className="Support  border-b mb-5 ">
          <h1 className="text-xl underline-offset-4 underline">Support</h1>
          <ul>
            <li className="small-footer-text">
              <Link>Privacy Policy</Link>
            </li>
            <li className="small-footer-text">
              <Link>Terms of Services</Link>
            </li>

            <li className="small-footer-text">
              <a href="/terms-and-conditions">Terms & Conditions: User</a>
            </li>
            <li className="small-footer-text">
              <a href="/refund-process">Refund Process</a>
            </li>
            <li className="small-footer-text">
              <a href="/vendor-policy">T & C Vendor</a>
            </li>
            <li className="small-footer-text">
              <a href="/delivery-instructions">Delivery Instruction</a>
            </li>
          </ul>
        </div>
      </section>

      <section className="Social flex flex-col justify-center items-center">
        <div className="flex gap-5 p-5 justify-center items-center">
          <Link
            className="Instagram hover:scale-110 transition "
            title="Instagram"
          >
            <Instagram />
          </Link>
          <Link className="Fb hover:scale-110 transition " title="Facebook">
            <Facebook />
          </Link>
          <Link
            className="linkedIn hover:scale-110 transition "
            title="Linkedin"
          >
            <Linkedin />
          </Link>
          <Link className="Youtube hover:scale-110 transition " title="Youtube">
            <Youtube />
          </Link>
          <Link className="Twitter hover:scale-110 transition " title="Twitter">
            <Twitter />
          </Link>
        </div>
        <div>
          <h1 className="text-sm flex flex-col justify-center items-center py-2">
            <span>Rider's Kart A Unit of Anonz Future OPC Pvt. Ltd. </span>
            Copyright and policies reserved by Anonz Future OPC Pvt. Ltd.
          </h1>
        </div>
      </section>
    </div>
  );
};

export default Footer;
