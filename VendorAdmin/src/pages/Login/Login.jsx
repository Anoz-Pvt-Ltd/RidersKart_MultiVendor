import React, { useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import { addUser, clearUser } from "../../utils/Slice/UserInfoSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingUI from "../../components/Loading";
import Button from "../../components/Button";
import { Eye, EyeOff } from "lucide-react"; // for eye icons

const LoginForm = ({
  startLoading,
  stopLoading,
  openRegister,
  openForgetPassword,
  onCancel,
}) => {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      startLoading();
      const response = await FetchData("vendor/login", "post", credentials);
      // console.log(response);
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.vendor));
      setSuccess("Login successful!");

      localStorage.clear();

      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.accessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.refreshToken
      );
      Navigate("/dashboard");
      alert("Login Successful");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 backdrop-blur-sm shadow-lg rounded-lg w-96">
      <h1 className="text-2xl font-bold text-gray-800 lg:mb-6">Login</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="lg:space-y-6">
        {/* Email Input */}
        <InputBox
          LabelName="Email"
          Type="email"
          Name="email"
          Value={credentials.email}
          Placeholder="Enter your email"
          onChange={handleChange}
        />

        {/* Password Input with toggle */}
        <div className="relative">
          <InputBox
            LabelName="Password"
            Type={showPassword ? "text" : "password"}
            Name="password"
            Value={credentials.password}
            Placeholder="Enter your password"
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-14 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-2 justify-center items-center ">
          <Button Type={"submit"} label={"Login"} className={"w-full"} />
          <Button
            label={"Cancel"}
            className={"w-full"}
            onClick={onCancel}
            Type="reset"
          />
        </div>
      </form>

      <div className="lg:block hidden">
        <p className="text-sm text-gray-500">
          Forget Password ?{" "}
          <span
            className="font-bold underline text-blue-500 cursor-pointer"
            onClick={openForgetPassword}
          >
            Reset Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoadingUI(LoginForm);
