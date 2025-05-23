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
  const ProfileEditFromRef = useRef(null);
  const EditAddressFromRef = useRef(null);
  const [error, setError] = useState("");
  const Dispatch = useDispatch();

  const user = useSelector((store) => store.UserInfo.user);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
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
  const openModal3 = () => {
    setShowModal3(true);
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
        alert("Profile updated successfully");
        closeModal2();
        window.location.reload();
      } else {
        setError("Failed to update profile.");
        window.location.reload();
      }
    } catch (err) {
      window.location.reload();
      alert(err.response?.data?.message || "Failed to update profile.");
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
        alert("Address deleted successfully");
        window.location.reload();
      } else {
        setError("Failed to delete address.");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete address.");
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
        alert("Address updated successfully");
        window.location.reload();
      } else {
        setError("Failed to update address.");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update address.");
      setError(err.response?.data?.message || "Failed to update address.");
    } finally {
      stopLoading();
    }
  };
  // console.log(user?.[0]?.address);

  return (
    <section className='flex justify-center items-center flex-col'>
      <div className='flex lg:flex-row flex-col w-full justify-evenly items-center lg:shadow py-2 rounded-xl'>
        {/* Profile_area */}
        <div className='name flex flex-col gap-2'>
          <h2 className='text-2xl font-bold lg:flex justify-center items-center hidden'>
            <span>
              <UserCheck className='mr-5' />
            </span>
            Your Profile
          </h2>
          <p>
            Name: <span className='lg:text-2xl'>{user?.[0]?.name}</span>
          </p>
          <p>
            Email: <span className='lg:text-2xl'>{user?.[0]?.email}</span>
          </p>
          <p>
            Number:{" "}
            <span className='lg:text-2xl'>{user?.[0]?.phoneNumber}</span>
          </p>
        </div>
        {/* all_FourButtons */}
        <div className='all_FourButtons flex flex-col gap-5 justify-center items-center mt-10 lg:mt-0'>
          <div className='button flex flex-col justify-evenly items-center gap-5 w-full'>
            <Button
              className={`hover:bg-green-500 hover:text-black w-full`}
              onClick={navigateHome}
              // label={<ShoppingBag/>"Continue Shopping"}
              label={
                <h1 className='flex justify-start gap-2'>
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
                <h1 className='flex justify-start gap-2'>
                  <span>
                    <LogOut />
                  </span>
                  Log Out{" "}
                </h1>
              }
            />
            {/* <Button label={"Add Address"} /> */}
          </div>
          <div className='button flex flex-col justify-evenly items-center gap-5 w-full'>
            <Button
              className={`hover:bg-green-500 hover:text-black w-full`}
              onClick={openModal}
              label={
                <h1 className='flex justify-start gap-2'>
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
                <h1 className='flex justify-start gap-2 w-full'>
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
      <div className='address flex flex-wrap flex-col'>
        <p className=' font-bold text-xl lg:hidden block'>Address:</p>
        <p className=' font-bold text-xl hidden lg:block'>Available address:</p>
        {/* address list  */}
        <div className='flex lg:flex-row flex-col flex-wrap justify-start items-center'>
          {user?.[0]?.address?.map((address, index) => (
            <div
              key={address._id}
              className='gap-5 flex justify-center items-center flex-row flex-wrap'
            >
              <span className='shadow m-2 p-4 rounded-xl'>
                <li className='ml-4 font-semibold list-none'>
                  Street:{" "}
                  <span className='font-normal text-lg '>{address.street}</span>
                </li>
                <li className='ml-4 font-semibold list-none'>
                  City:{" "}
                  <span className='font-normal text-lg '>{address.city}</span>
                </li>
                <li className='ml-4 font-semibold list-none'>
                  Country:{" "}
                  <span className='font-normal text-lg '>
                    {address.country}
                  </span>
                </li>
                <li className='ml-4 font-semibold list-none'>
                  Postal Code:{" "}
                  <span className='font-normal text-lg '>
                    {address.postalCode}
                  </span>
                </li>
                <li className='ml-4 font-semibold list-none'>
                  State:{" "}
                  <span className='font-normal text-lg '>{address.state}</span>
                </li>
                <div className='flex justify-center items-center gap-5 pt-5'>
                  <button
                    className='flex justify-center items-center gap-2 hover:text-green-500'
                    onClick={() => {
                      setEditAddress(address); // Set the address to edit
                      setEditAddressId(address._id); // (optional) if you need the id
                      openModal3();
                    }}
                  >
                    <PencilLine /> <span className='lg:hidden'>Edit</span>
                  </button>
                  <button
                    className='flex justify-center items-center gap-2 hover:text-red-500 '
                    onClick={() => DeleteAddress(address?._id)}
                  >
                    <Trash />
                    <span className='lg:hidden'>Delete</span>
                  </button>
                </div>
              </span>
            </div>
          ))}
        </div>
        {/* <AddressList/> */}
      </div>
      {/* Add address modal */}
      {showModal && (
        <div className='modal backdrop-blur-lg bg-black/70 fixed top-0 left-0 w-full h-full flex justify-center items-center'>
          <div className='modal-content flex  justify-center px-20 items-center gap-20 bg-white p-4 rounded-xl'>
            <form>
              <InputBox
                LabelName='Street'
                Placeholder='Enter street address'
                Name='street'
                Value={newAddress.street}
                onChange={handleAddressInputChange}
              />
              <InputBox
                LabelName='City'
                Placeholder='Enter city'
                Name='city'
                Value={newAddress.city}
                onChange={handleAddressInputChange}
              />
              <InputBox
                LabelName='State'
                Placeholder='Enter state'
                Name='state'
                Value={newAddress.state}
                onChange={handleAddressInputChange}
              />
              <InputBox
                LabelName='Country'
                Placeholder='Enter country'
                Name='country'
                Value={newAddress.country}
                onChange={handleAddressInputChange}
              />
              <InputBox
                LabelName='Postal Code'
                Placeholder='Enter postal code'
                Name='postalCode'
                Value={newAddress.postalCode}
                onChange={handleAddressInputChange}
              />

              <div className='flex justify-center items-center gap-5'>
                <Button
                  className={`mt-4  hover:bg-green-500 hover:text-black`}
                  type='button'
                  onClick={addAddress}
                  label='Add Address'
                />
                <Button
                  className={`mt-4  hover:bg-green-500 hover:text-black`}
                  type='button'
                  onClick={closeModal}
                  label='Cancel'
                />
              </div>
            </form>
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        </div>
      )}
      {/* Edit profile modal */}
      {showModal2 && (
        <div className=' fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg'>
          <h1 className='mb-5 text-center'>
            Hello <span className='text-2xl font-bold '>{user?.[0]?.name}</span>{" "}
            you can edit your account details here
          </h1>

          <div className='flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG'>
            <div className='lg:w-1/2 w-full'>
              <form
                ref={ProfileEditFromRef}
                onSubmit={handleEditProfileSubmit}
                className='w-full flex flex-col justify-center items-center px-5 py-2'
              >
                <InputBox
                  LabelName='Name'
                  Placeholder={user?.[0]?.name}
                  Name='name'
                  Value={editProfile.name}
                  Type='name'
                  onChange={handleAddressInputChange2}
                />
                <InputBox
                  LabelName='Email Address'
                  Placeholder={user?.[0]?.email}
                  Name='email'
                  Value={editProfile.email}
                  Type='email'
                  onChange={handleAddressInputChange2}
                />
                <InputBox
                  LabelName='Contact Number'
                  Placeholder={user?.[0]?.phoneNumber}
                  Name='phoneNumber'
                  Type='number'
                  Value={editProfile.phoneNumber}
                  onChange={handleAddressInputChange2}
                />
                <InputBox
                  LabelName='Password'
                  Placeholder='Password'
                  Name='password'
                  Value={editProfile.password}
                  Type='password'
                  onChange={handleAddressInputChange2}
                />
                <div className='flex justify-center items-center gap-5'>
                  <Button
                    type='button'
                    onClick={closeModal2}
                    label='Cancel'
                    className='mt-4 hover:bg-orange-500 lg:hidden block'
                  />
                  <Button
                    className={`mt-4 hover:bg-green-500 hover:text-black`}
                    type='submit'
                    label='Update Profile'
                  />
                </div>
              </form>
            </div>
            <div className='flex flex-col gap-5'>
              <Button
                type='button'
                onClick={closeModal2}
                label='Cancel'
                className='mt-4 hover:bg-orange-500 hidden lg:block'
              />
            </div>
          </div>
        </div>
      )}
      {showModal3 && (
        <div className=' fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg'>
          <h1 className='mb-5 text-center'>
            Hello <span className='text-2xl font-bold '>{user?.[0]?.name}</span>{" "}
            you can edit your address here
          </h1>

          <div className='flex justify-center items-center gap-10 lg:w-1/2 w-full  rounded-xl shadow lg:py-10 whiteSoftBG'>
            <div className='lg:w-1/2 w-full'>
              <form
                ref={EditAddressFromRef}
                onSubmit={handleEditAddress}
                className='w-full flex flex-col justify-center items-center px-5 py-2'
              >
                <InputBox
                  LabelName='Street'
                  Placeholder={editAddress.street}
                  Name='street'
                  Value={editAddress.street}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, street: e.target.value })
                  }
                />
                <InputBox
                  LabelName='City'
                  Placeholder={editAddress.city}
                  Name='city'
                  Value={editAddress.city}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, city: e.target.value })
                  }
                />
                <InputBox
                  LabelName='State'
                  Placeholder={editAddress.state}
                  Name='state'
                  Value={editAddress.state}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, state: e.target.value })
                  }
                />
                <InputBox
                  LabelName='Postal Code'
                  Placeholder={editAddress.postalCode}
                  Name='postalCode'
                  Value={editAddress.postalCode}
                  onChange={(e) =>
                    setEditAddress({
                      ...editAddress,
                      postalCode: e.target.value,
                    })
                  }
                />
                <InputBox
                  LabelName='Country'
                  Placeholder={editAddress.country}
                  Name='country'
                  Value={editAddress.country}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, country: e.target.value })
                  }
                />

                <div className='flex justify-center items-center gap-5'>
                  <Button
                    type='button'
                    onClick={closeModal3}
                    label='Cancel'
                    className='mt-4 hover:bg-orange-500 lg:hidden block'
                  />
                  <Button
                    className={`mt-4 hover:bg-green-500 hover:text-black`}
                    type='submit'
                    label='Update Profile'
                  />
                </div>
              </form>
            </div>
            <div className='flex flex-col gap-5'>
              <Button
                type='button'
                onClick={closeModal3}
                label='Cancel'
                className='mt-4 hover:bg-orange-500 hidden lg:block'
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoadingUI(ProfileSection);
