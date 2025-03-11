import React, { useState } from "react";
import { motion } from "framer-motion";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/Loading";

const steps = [
  "Basic Details",
  "Business Details",
  "Bank Details",
  "Address Details",
];

const VendorRegistrationForm = ({ startLoading, stopLoading }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const dataToSend = {
      ...formData,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
    };

    try {
      startLoading();
      const response = await FetchData("vendor/register", "post", dataToSend);
      if (response.status === 201) {
        setSuccess(
          "You are registered successfully! Once your id will be verified you can proceed for LOGIN"
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          contactNumber: "",
          businessName: "",
          gstNumber: "",
          panNumber: "",
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
          ifscCode: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        });
        setStep(0);
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
    <div className="p-6 h-[80vh] w-full bg-white shadow-lg rounded-lg flex flex-col justify-around">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Vendor Registration
      </h1>

      {/* Progress Bar */}
      <div className="relative flex items-center justify-between mb-6 ">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`h-3 w-full ${
                index < step ? "bg-green-500" : "bg-gray-300"
              } transition-all duration-500 rounded-full`}
            />
            <div
              className={`mt-2 px-4 py-1 rounded-full text-sm font-semibold 
              ${
                index <= step
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {step === 0 && (
            <>
              <InputBox
                LabelName="Business Owner Name"
                Name="name"
                Value={formData.name}
                Placeholder="Business Owner Name"
                onChange={handleChange}
              />
              <InputBox
                LabelName="Email"
                Type="email"
                Name="email"
                Value={formData.email}
                Placeholder="Business Owner Email"
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
                LabelName="Mobile Number"
                Name="contactNumber"
                Value={formData.contactNumber}
                Placeholder="Enter Mobile Number"
                onChange={handleChange}
              />
            </>
          )}

          {step === 1 && (
            <>
              <InputBox
                LabelName="Business Name"
                Name="businessName"
                Value={formData.businessName}
                Placeholder="Enter Business Name"
                onChange={handleChange}
              />
              <InputBox
                LabelName="Pan Number"
                Name="panNumber"
                Value={formData.panNumber}
                Placeholder="Enter GST Number"
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
                Type="file"
                LabelName={"Upload your G.S.T certificate"}
              />
            </>
          )}

          {step === 2 && (
            <>
              {/* <InputBox
                LabelName="Business Name"
                Name="businessName"
                Value={formData.businessName}
                Placeholder="Enter Business Name"
                onChange={handleChange}
              /> */}
              {/* <InputBox
                LabelName="GST Number"
                Name="gstNumber"
                Value={formData.gstNumber}
                Placeholder="Enter GST Number"
                onChange={handleChange}
              /> */}
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
            </>
          )}

          {step === 3 && (
            <>
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
            </>
          )}

          <div className="md:col-span-2 flex justify-between">
            {step > 0 && (
              <Button
                label="Back"
                onClick={prevStep}
                className=" hover:bg-red-500"
              />
            )}
            {step < 3 ? (
              <Button label="Next" onClick={nextStep} className={"w-1/3"} />
            ) : (
              <Button
                label="Register Vendor"
                Type="submit"
                className="w-1/3"
              />
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoadingUI(VendorRegistrationForm);
