import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import ProductCard from "../../Components/ProductCard";
import {
  Edit,
  Heart,
  ListOrdered,
  LogOut,
  Newspaper,
  PencilLine,
  Plus,
  ShoppingBag,
  Trash,
  User,
  UserCheck,
  X,
} from "lucide-react";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { useNavigate } from "react-router";
import { clearUser } from "../../Utility/Slice/UserInfoSlice";
import ProductCardMobile from "../../Components/ProductCardMobile";
import LoadingUI from "../../Components/Loading";
const ProfileSection = ({ startLoading, stopLoading }) => {
  const fromRef = useRef(null);
  const [error, setError] = useState("");
  const Dispatch = useDispatch();

  const user = useSelector((store) => store.UserInfo.user);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    country: "",
    postalCode: "",
    state: "",
  });
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddressInputChange2 = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addAddress = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${user?.[0]?._id}/addresses`,
        "post",
        newAddress
      );
      if (response.data.success) {
        // Assuming the response includes the new list of addresses
        // console.log(response.data.data);
        alert("Address added successfully");
        setShowModal(false); // Close modal after success
      } else {
        setError("Failed to add address.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add address.");
    } finally {
      stopLoading();
    }
  };
  const handleAddressChange = (index) => {
    setSelectedAddressIndex(index);
  };

  const navigateHome = () => {
    navigate("/");
  };
  const openModal = () => {
    setShowModal(true);
  };
  const openModal2 = () => {
    setShowModal2(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setNewAddress({
      street: "",
      city: "",
      country: "",
      postalCode: "",
      state: "",
    });
    setError(null); // Reset any errors
  };
  // Close modal
  const closeModal2 = () => {
    setShowModal2(false);
    setEditProfile({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
    setError(null); // Reset any errors
  };
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(fromRef.current);
    try {
      startLoading();
      const response = await FetchData(
        `users/edit-user-profile/${user?.[0]?._id}`,
        "post",
        formData
      );
      //   console.log(response);
      if (response.data.success) {
        alert("Profile updated successfully");
        closeModal2();
        window.location.reload();
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      stopLoading();
    }
  };
  const navigate = useNavigate();

  return (
    <section className="flex justify-center items-center flex-col">
      <div className="flex lg:flex-row flex-col w-full justify-evenly items-center lg:shadow py-2 rounded-xl">
        {/* Profile_area */}
        <div className="name">
          <h2 className="text-2xl font-bold lg:flex justify-center items-center hidden">
            <span>
              <UserCheck className="mr-5" />
            </span>
            Your Profile
          </h2>
          <p>
            Name:{" "}
            <span className="lg:text-2xl font-bold">{user?.[0]?.name}</span>
          </p>
          <p>
            Email:{" "}
            <span className="lg:text-2xl font-bold">{user?.[0]?.email}</span>
          </p>
          <p>
            Number:{" "}
            <span className="lg:text-2xl font-bold">
              {user?.[0]?.phoneNumber}
            </span>
          </p>
        </div>
        {/* all_FourButtons */}
        <div className="all_FourButtons flex flex-col gap-5 justify-center items-center mt-10 lg:mt-0">
          <div className="button flex flex-col justify-evenly items-center gap-5 w-full">
            <Button
              className={`hover:bg-green-500 hover:text-black w-full`}
              onClick={navigateHome}
              // label={<ShoppingBag/>"Continue Shopping"}
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <ShoppingBag />
                  </span>
                  Continue Shopping{" "}
                </h1>
              }
            />
            <Button
              className={` hover:bg-orange-500  hover:text-black w-full`}
              onClick={() => {
                Dispatch(clearUser());
                localStorage.removeItem("AccessToken");
                localStorage.removeItem("RefreshToken");
                alert("You are logged out! Please log in.");
                setTimeout(() => navigate("/login"), 100);
                // console.log(localStorage.getItem("RefreshToken"));
              }}
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <LogOut />
                  </span>
                  Log Out{" "}
                </h1>
              }
            />
            {/* <Button label={"Add Address"} /> */}
          </div>
          <div className="button flex flex-col justify-evenly items-center gap-5 w-full">
            <Button
              className={`hover:bg-green-500 hover:text-black w-full`}
              onClick={openModal}
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <Plus />
                  </span>
                  Add Address{" "}
                </h1>
              }
            />
            <Button
              className={`hover:bg-green-500 hover:text-black w-full`}
              onClick={openModal2}
              label={
                <h1 className="flex justify-start gap-2 w-full">
                  <span>
                    <Edit />
                  </span>
                  Edit Profile{" "}
                </h1>
              }
            />
            {/* <Button label={"Add Address"} /> */}
          </div>
        </div>
      </div>
      {/* address area */}
      <div className="address flex flex-wrap flex-col">
        <p className=" font-bold text-xl lg:hidden block">Address:</p>
        <p className=" font-bold text-xl hidden lg:block">
          Select a Default Address:
        </p>
        <div className="flex lg:flex-row flex-col">
          {user?.[0]?.address?.map((address, index) => (
            <div
              key={address._id}
              className="gap-5 flex justify-center items-center flex-row flex-wrap"
            >
              {/* <input
                className="hidden lg:block"
                type="radio"
                name="address"
                value={index}
                checked={selectedAddressIndex === index}
                onChange={() => handleAddressChange(index)}
              /> */}
              <span className="shadow m-2 p-4 rounded-xl">
                <li className="ml-4 font-semibold list-none">
                  Street: <span className="font-thin ">{address.street}</span>
                </li>
                <li className="ml-4 font-semibold list-none">
                  City: <span className="font-thin ">{address.city}</span>
                </li>
                <li className="ml-4 font-semibold list-none">
                  Country: <span className="font-thin ">{address.country}</span>
                </li>
                <li className="ml-4 font-semibold list-none">
                  Postal Code:{" "}
                  <span className="font-thin ">{address.postalCode}</span>
                </li>
                <li className="ml-4 font-semibold list-none">
                  State: <span className="font-thin ">{address.state}</span>
                </li>
                <div className="flex justify-center items-center gap-5 pt-5">
                  <button className="flex justify-center items-center gap-2 hover:text-green-500">
                    <PencilLine /> <span className="lg:hidden">Edit</span>
                  </button>
                  <button className="flex justify-center items-center gap-2 hover:text-red-500">
                    <Trash />
                    <span className="lg:hidden">Delete</span>
                  </button>
                </div>
              </span>
              {/* <Button
                className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                label={<PencilLine />}
              />
              <Button
                className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                label={<Trash />}
              /> */}
            </div>
          ))}
        </div>

        {/* <button onClick={openModal}>Add Address</button> */}

        {showModal && (
          <div className="modal backdrop-blur-lg fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="modal-content flex  justify-center items-center gap-20 bg-white p-4 rounded-xl">
              <span
                className="close cursor-pointer bg-neutral-300 rounded-full p-2 flex justify-center items-center text-3xl w-fit"
                onClick={closeModal}
              >
                &times;
              </span>
              <h3>Add New Address</h3>
              <form>
                <InputBox
                  LabelName="Street"
                  Placeholder="Enter street address"
                  Name="street"
                  Value={newAddress.street}
                  onChange={handleAddressInputChange}
                />
                <InputBox
                  LabelName="City"
                  Placeholder="Enter city"
                  Name="city"
                  Value={newAddress.city}
                  onChange={handleAddressInputChange}
                />
                <InputBox
                  LabelName="Country"
                  Placeholder="Enter country"
                  Name="country"
                  Value={newAddress.country}
                  onChange={handleAddressInputChange}
                />
                <InputBox
                  LabelName="Postal Code"
                  Placeholder="Enter postal code"
                  Name="postalCode"
                  Value={newAddress.postalCode}
                  onChange={handleAddressInputChange}
                />
                <InputBox
                  LabelName="State"
                  Placeholder="Enter state"
                  Name="state"
                  Value={newAddress.state}
                  onChange={handleAddressInputChange}
                />
                <Button
                  className={`mt-4 bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                  type="button"
                  onClick={addAddress}
                  label="Add Address"
                />
              </form>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        )}
        {showModal2 && (
          <div className=" fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg">
            <h1 className="mb-5 text-center">
              Hello{" "}
              <span className="text-2xl font-bold ">{user?.[0]?.name}</span> you
              can edit your account details here
            </h1>

            <div className="flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG">
              <div className="lg:w-1/2 w-full">
                <form
                  ref={fromRef}
                  onSubmit={handleEditProfileSubmit}
                  className="w-full flex flex-col justify-center items-center px-5 py-2"
                >
                  <InputBox
                    LabelName="Name"
                    Placeholder={user?.[0]?.name}
                    Name="name"
                    Value={editProfile.name}
                    Type="name"
                    onChange={handleAddressInputChange2}
                  />
                  <InputBox
                    LabelName="Email Address"
                    Placeholder={user?.[0]?.email}
                    Name="email"
                    Value={editProfile.email}
                    Type="email"
                    onChange={handleAddressInputChange2}
                  />
                  <InputBox
                    LabelName="Contact Number"
                    Placeholder={user?.[0]?.phoneNumber}
                    Name="phoneNumber"
                    Type="number"
                    Value={editProfile.phoneNumber}
                    onChange={handleAddressInputChange2}
                  />
                  <InputBox
                    LabelName="Password"
                    Placeholder="Password"
                    Name="password"
                    Value={editProfile.password}
                    Type="password"
                    onChange={handleAddressInputChange2}
                  />
                  <div className="flex justify-center items-center gap-5">
                    <Button
                      type="button"
                      onClick={closeModal2}
                      label="Cancel"
                      className="mt-4 hover:bg-orange-500 lg:hidden block"
                    />
                    <Button
                      className={`mt-4 hover:bg-green-500 hover:text-black`}
                      type="submit"
                      label="Update Profile"
                    />
                  </div>
                </form>
              </div>
              <div className="flex flex-col gap-5">
                <Button
                  type="button"
                  onClick={closeModal2}
                  label="Cancel"
                  className="mt-4 hover:bg-orange-500 hidden lg:block"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoadingUI(ProfileSection);
