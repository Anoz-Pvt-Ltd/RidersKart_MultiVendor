import React, { useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";

const UserRegister = () => {
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
      const response = await FetchData("users/register", "post", dataToSend);

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
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, register your account here and get started
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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

        <div className="md:col-span-2">
          <Button label={"Register"} Type={"submit"} className={"w-full"} />
        </div>
      </form>
    </div>
  );
};

export default UserRegister;
