import React, { useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const VendorRegistrationForm = ({ startLoading, stopLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    gstNumber: "",
    businessName: "",
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    password: "", // Added password field
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
      contactNumber,
      address,
      city,
      state,
      country,
      postalCode,
      gstNumber,
      businessName,
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
      password,
    } = formData;

    const dataToSend = {
      name,
      email,
      contactNumber,
      password, // Ensure the password is included
      location: {
        address,
        city,
        state,
        country,
        postalCode,
      },
      gstNumber,
      businessName,
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
    };

    try {
      startLoading();
      const response = await FetchData("vendor/register", "post", dataToSend);

      if (response.status === 201) {
        setSuccess("Vendor registered successfully!");
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          gstNumber: "",
          businessName: "",
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
          ifscCode: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Vendor Registration
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <InputBox
          LabelName="Vendor Name"
          Name="name"
          Value={formData.name}
          Placeholder="Enter Vendor Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={formData.email}
          Placeholder="Enter Vendor Email"
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
          Name="contactNumber"
          Value={formData.contactNumber}
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
        <InputBox
          LabelName="GST Number"
          Name="gstNumber"
          Value={formData.gstNumber}
          Placeholder="Enter GST Number"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Business Name"
          Name="businessName"
          Value={formData.businessName}
          Placeholder="Enter Business Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Account Holder Name"
          Name="accountHolderName"
          Value={formData.accountHolderName}
          Placeholder="Enter Account Holder Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Account Number"
          Name="accountNumber"
          Value={formData.accountNumber}
          Placeholder="Enter Account Number"
          onChange={handleChange}
        />
        <InputBox
          LabelName="Bank Name"
          Name="bankName"
          Value={formData.bankName}
          Placeholder="Enter Bank Name"
          onChange={handleChange}
        />
        <InputBox
          LabelName="IFSC Code"
          Name="ifscCode"
          Value={formData.ifscCode}
          Placeholder="Enter IFSC Code"
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <Button
            className={`w-full bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
            label={"Register Vendor"}
            Type={"submit"}
          />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(VendorRegistrationForm);
