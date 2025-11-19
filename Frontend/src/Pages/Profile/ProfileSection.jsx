import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import {
  Calculator,
  Check,
  Edit,
  Headset,
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
import { alertError, alertInfo, alertSuccess } from "../../Utility/Alert";
import UserTC from "./UserProfile_T_C";
import OrderSection from "./OrderSection";
import UserFAQ from "./UserProfile_FAQ";
import { truncateString } from "../../Utility/Utility-functions";
import MapInput from "../../Components/MapInput";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";

const ProfileSection = ({ startLoading, stopLoading }) => {
  const ProfileEditFromRef = useRef(null);
  const EditAddressFromRef = useRef(null);
  const HandleSupport = useRef(null);
  const [error, setError] = useState("");
  const Dispatch = useDispatch();
  const user = useSelector((store) => store.UserInfo.user);
  // const [allOrders, setAllOrders] = useState([]);
  // console.log(user);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
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
  const [editAddress, setEditAddress] = useState({
    street: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
  });
  const [editAddressId, setEditAddressId] = useState(null); // (optional)

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
        alertSuccess("Address added successfully");
        setShowModal(false); // Close modal after success
        window.location.reload();
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
  const openModal3 = () => {
    setShowModal3(true);
  };
  const openModal4 = () => {
    setShowModal4(true);
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
  const closeModal3 = () => {
    setShowModal3(false);
    setEditAddress({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
    setError(null); // Reset any errors
  };
  const closeModal4 = () => {
    setShowModal4(false);
    // setEditAddress({
    //   name: "",
    //   email: "",
    //   phoneNumber: "",
    //   password: "",
    // });
    setError(null); // Reset any errors
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(ProfileEditFromRef.current);
    try {
      startLoading();
      const response = await FetchData(
        `users/edit-user-profile/${user?.[0]?._id}`,
        "post",
        formData
      );
      //   console.log(response);
      if (response.data.success) {
        alertSuccess("Profile updated successfully");
        closeModal2();
        window.location.reload();
      } else {
        setError("Failed to update profile.");
        window.location.reload();
      }
    } catch (err) {
      window.location.reload();
      alertError(err.response?.data?.message || "Failed to update profile.");
      console(err.response?.data?.message || "Failed to update profile.");
    } finally {
      window.location.reload();
      stopLoading();
    }
  };
  const navigate = useNavigate();

  const DeleteAddress = async (addressId) => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${user?.[0]?._id}/addresses/${addressId}`,
        "delete"
      );
      if (response.data.success) {
        alertSuccess("Address deleted successfully");
        window.location.reload();
      } else {
        setError("Failed to delete address.");
      }
    } catch (err) {
      console.log(err);
      alertError(err.response?.data?.message || "Failed to delete address.");
      setError(err.response?.data?.message || "Failed to delete address.");
    } finally {
      stopLoading();
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const response = await FetchData(
        `users/${user[0]._id}/addresses/${editAddressId}`,
        "post",
        editAddress
      );
      if (response.data.success) {
        alertSuccess("Address updated successfully");
        window.location.reload();
      } else {
        setError("Failed to update address.");
      }
    } catch (err) {
      console.log(err);
      alertError(err.response?.data?.message || "Failed to update address.");
      setError(err.response?.data?.message || "Failed to update address.");
    } finally {
      stopLoading();
    }
  };

  const makeDefaultAddress = async (addressId) => {
    console.log(addressId);
    try {
      startLoading();
      const response = await FetchData(
        `users/${user?.[0]?._id}/addresses/${addressId}/set-default-address`,
        "post"
      );
      alertSuccess("Default address set successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alertError(
        err.response?.data?.message || "Failed to set default address."
      );
      // setError(err.response?.data?.message || "Failed to set default address.");
    } finally {
      stopLoading();
    }
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(HandleSupport.current);
      if (!user?.[0]?._id) {
        alertError("Please login to submit support request.");
        closeModal4();
        return;
      }
      const response = await FetchData(
        `users/support/${user?.[0]?._id}`,
        "post",
        formData
      );
      console.log(response);
      alertSuccess(response.data.message);
      closeModal4();
    } catch (err) {
      console.log(err);
      alertError(parseErrorMessage(err.response?.data));
      closeModal4();
    } finally {
      stopLoading();
    }
  };

  return (
    <section className="flex justify-center items-center flex-col">
      <div className="flex flex-col-reverse lg:flex-col w-full justify-evenly items-start lg:shadow py-2 rounded-xl lg:px-20 gap-5">
        {/* all_FourButtons */}
        <div className="all_FourButtons flex lg:gap-5 justify-center items-center w-full">
          <div className="button flex justify-start items-center lg:gap-3 gap-1 w-full flex-col lg:flex-row md:flex-row ">
            <Button
              className={`lg:w-fit w-full`}
              onClick={navigateHome}
              // label={<ShoppingBag/>"Continue Shopping"}
              label={
                <h1 className="flex justify-start gap-2 md:truncate">
                  <span>
                    <ShoppingBag />
                  </span>
                  Continue Shopping{" "}
                </h1>
              }
            />
            <Button
              className={`lg:w-fit w-full`}
              onClick={() => {
                Dispatch(clearUser());
                localStorage.removeItem("AccessToken");
                localStorage.removeItem("RefreshToken");
                alertInfo("You are logged out! Please log in.");
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
            <Button
              className={`lg:w-fit w-full`}
              onClick={openModal2}
              label={
                <h1 className="flex justify-start gap-2 w-full">
                  <span>
                    <Edit />
                  </span>
                  Profile{" "}
                </h1>
              }
            />
            <Button
              className={`lg:w-fit w-full`}
              onClick={openModal4}
              label={
                <h1 className="flex justify-start gap-2 w-full">
                  <span>
                    <Headset />
                  </span>
                  Support{" "}
                </h1>
              }
            />
            {/* <Button label={"Add Address"} /> */}
            <Button
              className={`lg:w-fit w-full lg:hidden flex `}
              onClick={openModal}
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <Plus />
                  </span>
                  Address{" "}
                </h1>
              }
            />
          </div>
        </div>
        <div className="flex flex-col justify-evenly items-start w-full">
          {/* Profile_area */}
          <div className="bg-neutral-50 p-6 rounded-2xl shadow-md mb-8 lg:w-3/4 w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 text-gray-600">
              <div>
                <strong>Name:</strong> {user?.[0]?.name}
              </div>
              <div>
                <strong>Email:</strong> {user?.[0]?.email}
              </div>
              <div>
                <strong>Contact Number:</strong> {user?.[0]?.phoneNumber}
              </div>
              <div>
                <strong>Default address:</strong>{" "}
                <h1 className=" text-xs">
                  <p className="shadow rounded-xl bg-neutral-200 py-2 px-3 w-fit">
                    <li className=" font-semibold list-none">
                      Street:{" "}
                      <span className="font-normal text-xs ">
                        {truncateString(
                          user?.[0]?.defaultAddress?.street || "Not available",
                          20
                        )}
                        ,
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      City:{" "}
                      <span className="font-normal text-xs ">
                        {user?.[0]?.defaultAddress?.city || "Not available"},
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Country:{" "}
                      <span className="font-normal text-xs ">
                        {user?.[0]?.defaultAddress?.country || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Postal Code:{" "}
                      <span className="font-normal text-xs ">
                        {user?.[0]?.defaultAddress?.postalCode ||
                          "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      State:{" "}
                      <span className="font-normal text-xs ">
                        {user?.[0]?.defaultAddress?.state || "Not available"}
                      </span>
                    </li>
                  </p>
                </h1>
              </div>
            </div>
          </div>
          {/* address area */}
          <div className="address flex flex-wrap flex-col w-full">
            <p className=" font-bold lg:hidden block">Address:</p>
            <p className=" font-bold  hidden lg:block">Available address:</p>
            {/* address list  */}

            <div className="flex lg:flex-row flex-col flex-wrap justify-start items-center text-xs">
              {user?.[0]?.address?.map((address, index) => (
                <div
                  key={address._id}
                  className="gap-5 flex justify-center items-center flex-row flex-wrap w-full lg:w-fit"
                >
                  <span className="shadow m-1 py-3 px-2 rounded-xl bg-neutral-200 w-full lg:w-fit">
                    <li className=" font-semibold list-none">
                      Street:{" "}
                      <span className="font-normal text-xs ">
                        {truncateString(address?.street || "Not available", 10)}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      City:{" "}
                      <span className="font-normal text-xs ">
                        {address?.city || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Country:{" "}
                      <span className="font-normal text-xs ">
                        {address?.country || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Postal Code:{" "}
                      <span className="font-normal text-xs ">
                        {address?.postalCode || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      State:{" "}
                      <span className="font-normal text-xs ">
                        {address?.state || "Not available"}
                      </span>
                    </li>
                    <div className="flex justify-evenly items-center gap-5 pt-2">
                      <button
                        className="flex justify-center items-center gap-2 hover:text-green-500"
                        onClick={() => {
                          setEditAddress(address); // Set the address to edit
                          setEditAddressId(address._id); // (optional) if you need the id
                          openModal3();
                        }}
                      >
                        <PencilLine className="h-4 w-4" />{" "}
                        <span className="lg:hidden">Edit</span>
                      </button>
                      <button
                        className="flex justify-center items-center gap-2 hover:text-red-500 "
                        onClick={() => DeleteAddress(address?._id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="lg:hidden">Delete</span>
                      </button>
                      <button
                        className="flex justify-center items-center gap-2 hover:text-red-500 "
                        onClick={() => makeDefaultAddress(address?._id)}
                      >
                        <Check className="h-4 w-4 border-black border rounded-full" />
                        <span className="lg:hidden">Default</span>
                      </button>
                    </div>
                  </span>
                </div>
              ))}
              <button
                onClick={openModal}
                className="hidden border border-dashed h-full lg:flex justify-center items-center px-10 py-10 border-black rounded-xl"
              >
                <h1 className="flex flex-col justify-center items-center ">
                  <Plus />
                  Address
                </h1>
              </button>
            </div>
            {/* <AddressList/> */}
          </div>
        </div>
      </div>
      <UserFAQ />
      <UserTC />

      {/* Add address modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -100 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", duration: 0.3, ease: "easeInOut" }}
            className="modal backdrop-blur-lg bg-black/70 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
          >
            <div className="modal-content flex  justify-center px-20 items-center gap-20 bg-white p-4 rounded-xl">
              <div className="w-1/2">
                <MapInput />
              </div>
              <form className="w-full flex flex-col justify-center items-center px-5 py-2">
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
                  LabelName="State"
                  Placeholder="Enter state"
                  Name="state"
                  Value={newAddress.state}
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

                <div className="flex justify-center items-center gap-5">
                  <Button
                    className={`mt-4  hover:bg-green-500 hover:text-black`}
                    type="button"
                    onClick={addAddress}
                    label="Add Address"
                  />
                  <Button
                    className={`mt-4  hover:bg-green-500 hover:text-black`}
                    type="button"
                    onClick={closeModal}
                    label="Cancel"
                  />
                </div>
              </form>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit profile modal */}
      <AnimatePresence>
        {showModal2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className=" fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg z-50 bg-black/70"
          >
            <h1 className="mb-5 text-center text-white">
              Hello <span className=" font-bold ">{user?.[0]?.name}</span> you
              can edit your account details here
            </h1>

            <div className="flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG">
              <div className="lg:w-1/2 w-full">
                <form
                  ref={ProfileEditFromRef}
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
                      className="mt-4"
                    />
                    <Button className={`mt-4 `} type="submit" label="Submit" />
                  </div>
                </form>
              </div>
              {/* <div className="flex flex-col gap-5">
              <Button
                type="button"
                onClick={closeModal2}
                label="Cancel"
                className="mt-4 hover:bg-orange-500 hidden lg:block"
              />
            </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal3 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className=" fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg z-50 bg-black/70"
          >
            <h1 className="mb-5 text-center text-white">
              Hello{" "}
              <span className="text-2xl font-bold ">{user?.[0]?.name}</span> you
              can edit your address here
            </h1>
            {/* //remove comment when API for maps willbe available */}
            <div className="w-full flex justify-center items-start">
              {/* <div>
                <MapInput className="text-white" />
              </div> */}
              <div className="flex justify-center items-center gap-10  w-full  rounded-xl shadow lg:py-10 whiteSoftBG">
                {/* <div className="flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG"> */}
                <div className=" w-full flex">
                  {/* <div className="lg:w-1/2 w-full flex"> */}
                  <MapInput />
                  <form
                    ref={EditAddressFromRef}
                    onSubmit={handleEditAddress}
                    className="w-full flex flex-col justify-center items-center px-5 py-2"
                  >
                    <InputBox
                      LabelName="Street"
                      Placeholder={editAddress.street}
                      Name="street"
                      Value={editAddress.street}
                      onChange={(e) =>
                        setEditAddress({
                          ...editAddress,
                          street: e.target.value,
                        })
                      }
                    />
                    <InputBox
                      LabelName="City"
                      Placeholder={editAddress.city}
                      Name="city"
                      Value={editAddress.city}
                      onChange={(e) =>
                        setEditAddress({ ...editAddress, city: e.target.value })
                      }
                    />
                    <InputBox
                      LabelName="State"
                      Placeholder={editAddress.state}
                      Name="state"
                      Value={editAddress.state}
                      onChange={(e) =>
                        setEditAddress({
                          ...editAddress,
                          state: e.target.value,
                        })
                      }
                    />
                    <InputBox
                      LabelName="Postal Code"
                      Placeholder={editAddress.postalCode}
                      Name="postalCode"
                      Value={editAddress.postalCode}
                      onChange={(e) =>
                        setEditAddress({
                          ...editAddress,
                          postalCode: e.target.value,
                        })
                      }
                    />
                    <InputBox
                      LabelName="Country"
                      Placeholder={editAddress.country}
                      Name="country"
                      Value={editAddress.country}
                      onChange={(e) =>
                        setEditAddress({
                          ...editAddress,
                          country: e.target.value,
                        })
                      }
                    />

                    <div className="flex justify-center items-center gap-5">
                      <Button
                        type="button"
                        onClick={closeModal3}
                        label="Cancel"
                        className="mt-4"
                      />
                      <Button
                        className={`mt-4 hover:bg-green-500 hover:text-black`}
                        type="submit"
                        label="Update Profile"
                      />
                    </div>
                  </form>
                </div>
                {/* <div className="flex flex-col gap-5">
                <Button
                  type="button"
                  onClick={closeModal3}
                  label="Cancel"
                  className="mt-4 hover:bg-orange-500 hidden lg:block"
                />
              </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal4 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className=" fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg z-50 bg-black/70"
          >
            <h1 className="mb-5 text-center text-white">
              Hello <span className=" font-bold ">{user?.[0]?.name}</span>, How
              can we help you today ?
            </h1>

            <div className="flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG">
              <div className="lg:w-1/2 w-full">
                <form
                  ref={HandleSupport}
                  onSubmit={handleSupport}
                  className="w-full flex flex-col justify-center items-center px-5 py-2"
                >
                  <label
                    htmlFor={"description"}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Please describe your issue:
                  </label>
                  <textarea
                    required
                    className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md`}
                  />
                  <p>Our team will reach you within 24 - 48 hours.</p>
                  <p className="lg:text-nowrap ">
                    For urgent assistance, you may also write to us at:{" "}
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@riderskart.in&su=Help%20Support&body="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      support@riderskart.in
                    </a>
                  </p>
                  <div className="flex justify-center items-center gap-5">
                    <Button
                      type="button"
                      onClick={closeModal4}
                      label="Cancel"
                      className="mt-4"
                    />
                    <Button className={`mt-4 `} type="submit" label="Submit" />
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LoadingUI(ProfileSection);
