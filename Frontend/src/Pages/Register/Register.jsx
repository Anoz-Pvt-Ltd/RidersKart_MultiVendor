import React, { useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { addUser, clearUser } from "../../Utility/Slice/UserInfoSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingUI from "../../Components/Loading";
import { alertError, alertSuccess } from "../../Utility/Alert";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";

const UserRegister = ({ startLoading, stopLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Structure the data to match the controller's requirements
    const {
      name,
      email,
      phoneNumber,
      address,
      city,
      state,
      country,
      postalCode,
      password,
    } = formData;

    // Adjusting the address to match the schema format
    const addressObj = {
      street: address, // Assuming the street is being entered in the address field
      city,
      state,
      country,
      postalCode,
    };

    const dataToSend = {
      name,
      email,
      phoneNumber, // This matches the model
      password, // Ensure the password is included
      address: addressObj, // Pass the structured address
    };
    console.log(dataToSend);

    try {
      startLoading();
      const response = await FetchData("users/register", "post", dataToSend);
      console.log(response);

      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem("AccessToken", response.data.data.token.AccessToken);
      localStorage.setItem(
        "RefreshToken",
        response.data.data.token.RefreshToken
      );
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      navigate("/");
      alertSuccess(response.data.message);

      if (response.status === 201) {
        setSuccess("User registered successfully!");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "", // reset phone number field
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          password: "", // reset password field
        });
      }
    } catch (err) {
      console.log(err);
      alertError(parseErrorMessage(err.response?.data));
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white drop-shadow-2xl my-5 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome!
        <br /> Register your account here and get started
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:gap-x-5"
      >
        <InputBox
          LabelName="Name"
          Name="name"
          Value={formData.name}
          Placeholder="Enter Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={formData.email}
          Placeholder="Enter Email"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Password"
          Type="password"
          Name="password"
          Value={formData.password}
          Placeholder="Enter Password"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Contact Number"
          Name="phoneNumber" // updated name
          Value={formData.phoneNumber} // updated value
          Placeholder="Enter Contact Number"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Address"
          Name="address"
          Value={formData.address}
          Placeholder="Enter Address"
          onChange={handleChange}
        />
        <InputBox
          LabelName="City"
          Name="city"
          Value={formData.city}
          Placeholder="Enter City"
          onChange={handleChange}
        />
        <InputBox
          LabelName="State"
          Name="state"
          Value={formData.state}
          Placeholder="Enter State"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Country"
          Name="country"
          Value={formData.country}
          Placeholder="Enter Country"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Postal Code"
          Name="postalCode"
          Value={formData.postalCode}
          Placeholder="Enter Postal Code"
          onChange={handleChange}
        />
        <div className="flex justify-start items-center gap-5">
          <div className="w-fit h-fit  ">
            <InputBox Name="privacyPolicy" className="" Type="checkbox" />
          </div>
          <Link to={"/terms-and-conditions"}>
            <span className="text-blue-600 hover:text-blue-800 hover:underline">
              Read our terms and conditions
            </span>
          </Link>
        </div>

        <div className="md:col-span-2">
          <Button
            className={`w-full text-blue-600 hover:bg-green-500`}
            label={"Register"}
            Type={"submit"}
          />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(UserRegister);
