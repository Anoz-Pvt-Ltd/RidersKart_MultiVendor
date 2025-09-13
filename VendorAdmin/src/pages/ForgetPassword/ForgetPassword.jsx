import React, { useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/Loading";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useNavigate } from "react-router-dom";

const ForgetPassword = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [isOpenOtpModel, setIsOpenOtpModel] = useState(false);

  // Handle first form submit
  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);

      const email = formData.get("email");
      const contactNumber = formData.get("contactNumber");

      const response = await FetchData(
        "vendor/forget-password/generate-otp",
        "post",
        formData
      );

      console.log(response);
      alert(response.data.message);
      setIsOpenOtpModel(true);
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  // Handle OTP form submit
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);

      const response = await FetchData(
        "vendor/forget-password/reset-password",
        "post",
        formData
      );
      console.log(response);
      alert(response.data.message);
      navigate("/login"); // redirect after success
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
      window.location.reload();
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex justify-center items-center flex-col shadow lg:px-20 px-5 py-10 rounded-xl">
        <h1>Forget password ?</h1>
        <form ref={formRef} className="w-full" onSubmit={handleOTPSubmit}>
          <InputBox
            LabelName={"Enter email"}
            Placeholder={"Email"}
            Name={"email"}
          />
          <InputBox
            LabelName={"Enter contact number"}
            Placeholder={"Contact Number"}
            Name={"contactNumber"}
          />
          {isOpenOtpModel === true ? (
            <h1 className="w-full text-left text-red-500 flex flex-col text-xs lg:text-base">
              <span>OTP generated successfully on your contact number</span>
              ** Note OTP will be valid for 1 minute only
            </h1>
          ) : (
            <Button label="Generate OTP" onClick={handleGenerateOTP} />
          )}
          {/* <Button label="Generate OTP" Type="submit" /> */}
          {isOpenOtpModel && (
            <>
              <InputBox
                LabelName={"Enter OTP"}
                Placeholder={"Enter OTP"}
                Name={"otp"}
                Type="text"
              />
              <InputBox
                LabelName={"New password"}
                Placeholder={"*********"}
                Name={"newPassword"}
                Type="password"
              />
              <InputBox
                LabelName={"Confirm password"}
                Placeholder={"*********"}
                Name={"confirmNewPassword"}
                Type="password"
              />
              <Button label="Confirm" Type="submit" className="w-full" />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoadingUI(ForgetPassword);
