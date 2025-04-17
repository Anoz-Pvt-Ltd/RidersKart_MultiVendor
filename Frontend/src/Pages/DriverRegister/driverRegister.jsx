import { useRef, useState } from "react";
import Button from "../../Components/Button";
import { FetchData } from "../../../utility/fetchFromAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import InputBox from "../../Components/InputBox";
import SelectBox from "../../Components/SelectionBox";

export default function RegisterDriver() {
  // variables----------------------------------------------------------------
  const FormRef = useRef();
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  // function ----------------------------------------------------------------

  // Handel submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(FormRef.current);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Validate phone number (must be 10 digits)
    const phone = formData.get("phone");
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    // Validate Aadhar number (12 digits)
    const aadharNumber = formData.get("aadharNumber");
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      alert("Please enter a valid aadhar number");
      return;
    }

    // Validate PAN number (10 characters, alphanumeric, specific format)
    const panNumber = formData.get("panNumber");
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      alert("Please enter a valid Pan number");
      return;
    }

    // Validate Driving License number (adjust based on local rules, typically alphanumeric)
    const licenseNumber = formData.get("licenseNumber");
    const dlRegex = /^[A-Z]{2}\d{13}$/; // Adjust this regex as per the regional format
    if (!dlRegex.test(licenseNumber)) {
      alert("Please enter a valid Driving License number");
      return;
    }

    const plateNumber = formData.get("plateNumber");
    const plateRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (!plateRegex.test(plateNumber)) {
      alert("Please enter a valid Plate number");
      return;
    }

    try {
      const response = await FetchData("driver/register", "post", formData);

      console.log(response);

      alertSuccess(response.data.message);

      // Reset form fields and clear image previews
      FormRef.current.reset();

      // Navigate to home page and show success message
      navigate("/");
    } catch (error) {
      console.log(error);
      // alertError(parseErrorMessage(error.response.data));
    }
  };

  return (
    <div className="max-w-[80vw] mx-auto my-10  rounded-lg shadow-2xl shadow-white-300 p-8 bg-[#949597]">
      <h1 className="text-3xl font-bold mb-6 heading-text-gray">
        Personal Details <br />
        <span className="text-red-600 font-thin text-sm">
          **All fields are Required
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        ref={FormRef}
        className="space-y-6 w-full flex justify-center items-center flex-col  "
      >
        <div className="Personal-details w-full grid laptop:grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-6">
          {/* Name */}
          <div className="mb-3">
            <InputBox
              LabelName="Name"
              Name="name"
              Placeholder="Enter your name"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <InputBox
              LabelName="Phone number"
              Name="phone"
              Type="number"
              Placeholder="Enter your contact number"
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <InputBox
              LabelName="Address"
              Name="address"
              Placeholder="Enter your address"
            />
          </div>

          {/* Driving License */}
          <div className="mb-3">
            <InputBox
              LabelName="Driving License Number"
              Name="licenseNumber"
              Placeholder="Your Driving License Number"
            />
            <InputBox
              LabelName="Driving License Image"
              Name="licenseImage"
              Type="file"
              Placeholder="Your Driving License Image"
            />
          </div>

          {/* Aadhar */}
          <div className="mb-3">
            <InputBox
              LabelName="Aadhar Card Number"
              Name="aadharNumber"
              Type="number"
              Placeholder="Your Aadhar Card Number"
            />
            <InputBox
              LabelName="Aadhar Card Image"
              Name="aadharImage"
              Type="file"
              Placeholder="Your Aadhar Card Image"
            />
          </div>

          {/* PAN */}
          <div className="mb-3">
            <InputBox
              LabelName="Pan Card Number"
              Name="panNumber"
              Type="text"
              Placeholder="Your Pan Card Number"
            />
            <InputBox
              LabelName="Pan Card Image"
              Name="panImage"
              Type="file"
              Placeholder="Your Pan Card Image"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <InputBox
              LabelName="Password"
              Name="password"
              Type="password"
              Placeholder="Your Password"
            />
          </div>

          {/* Physical Disability */}
          <div className="mb-3 flex items-center gap-4 justify-start  ">
            <InputBox
              LabelName="Any Physical Disability:"
              Name="physicallyDisabled"
              Type="checkbox"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-5 w-full">Vehicle Details</h2>

        <div className="Vehicle-details grid laptop:grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div className="mb-3">
            <select
              name="vehicleType"
              className=" border-l-2 border-b-2 backdrop-blur-xl border-gray-900/30 txt-light-brown text-sm rounded-lg block w-4/5 mb-4 p-2.5 dark:placeholder-white dark:text-black drop-shadow-xl focus:outline-none "
            >
              <option value="bike">Bike</option>
              <option value="scooty">Scooty</option>
              <option value="pickup">Pickup</option>
              <option value="truck">Truck</option>
              <option value="Electric Bike"> Electric Bike </option>
              <option value="Electric vehicle (3/4 wheeler)">
                Electric vehicle (3/4 wheeler)
              </option>
            </select>

            {/* Options are not set properly yet */}
            <SelectBox LabelName="Select Vehicle Type:" Name="vehicleType" />
          </div>

          {/* Vehicle Description */}
          <div className="mb-3">
            <label>Vehicle Description:</label>
            <textarea
              type="text"
              name="vehicleDescription"
              className=" border-l-2 border-b-2 backdrop-blur-xl border-gray-900/30 txt-light-brown text-sm rounded-lg block w-80 mb-4 p-2.5 dark:placeholder-white dark:text-black drop-shadow-xl focus:outline-none "
              required
            />
          </div>

          {/* Plate No */}
          <div className="mb-3">
            <InputBox
              LabelName="Plate Number:"
              Name="plateNumber"
              Placeholder="Plate Number"
            />
          </div>

          {/* RAC Front and Back Images */}
          <div>
            <InputBox
              LabelName="Upload RAC Front Image:"
              Name="racFrontImage"
              Type="file"
              Placeholder="RAC Front Image"
            />
          </div>
          <div>
            <InputBox
              LabelName="Upload RAC back Image:"
              Name="racBackImage"
              Type="file"
              Placeholder="RAC Back Image"
            />
          </div>

          {/* Insurance Image */}
          <div className="mb-3">
            <InputBox
              LabelName="Insurance Number:"
              Name="insuranceNumber"
              Placeholder="Policy Number"
            />
            <InputBox
              LabelName="Insurance Expiry:"
              Name="insuranceExpiry"
              Type="date"
              Placeholder="Policy Expiry Date"
            />

            <InputBox
              LabelName="Upload Insurance Image:"
              Name="insuranceImage"
              Type="file"
              Placeholder="Insurance Image"
            />
          </div>

          {/* Pollution Certificate Image (Optional) */}
          <div className="mb-3">
            <InputBox
              LabelName="Upload Pollution Certificate:"
              Name="pollutionImage"
              Type="file"
              Placeholder="Insurance Image"
              Required={false}
            />
          </div>
        </div>

        <ButtonWrapper type="submit" className={"w-40  "}>
          Submit
        </ButtonWrapper>
      </form>
    </div>
  );
}
