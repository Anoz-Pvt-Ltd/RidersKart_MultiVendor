import React, { useRef } from "react";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch } from "react-redux";
import { clearUser, addUser } from "../../Utility/Slice/UserInfoSlice";
import LoadingUI from "../../Components/Loading";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";

const Login = ({ startLoading, stopLoading }) => {
  const Navigate = useNavigate();
  const Dispatch = useDispatch();

  const NavigateRegister = () => {
    Navigate("/register");
  };

  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    startLoading(); // Start loading when login button is clicked

    try {
      const response = await FetchData("users/login", "post", formData);
      console.log(response);
      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.AccessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.RefreshToken
      );

      alert(response.data.message);
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      setSuccess("Login successful!");
      Navigate("/");
    } catch (err) {
      console.log(err);
      // alert(parseErrorMessage(error.response.data.data.statusCode));
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading(); // Stop loading once response is received
    }
  };

  return (
    <div>
      <section className="flex lg:m-28 lg:border rounded-lg lg:shadow-md lg:shadow-neutral-300 lg:h-96 my-20">
        <div className="lg:w-1/2 p-10 rounded-lg rounded-r-none headerBg text-white hidden lg:block">
          <h1 className="text-4xl h-3/4 text-white font-semibold">
            Login with your e-mail to get started !
          </h1>
          <h1 className="flex justify-around items-center">
            If you are not registered with us create your new account here{" "}
            <MoveRight />
          </h1>
        </div>
        <div className=" lg:w-1/2 w-full flex justify-center items-center flex-col lg:whiteSoftBG">
          <form
            ref={formRef}
            className="login h-3/4 flex justify-top items-top flex-col w-3/4"
          >
            <InputBox
              onChange={handleChange}
              LabelName={"Login"}
              Placeholder={"Email Address"}
              Type={"email"}
              className={"w-full"}
              Name={"email"}
              Value={formData.email}
            />
            <InputBox
              onChange={handleChange}
              LabelName={"Password"}
              Placeholder={"Password"}
              Type={"password"}
              className={"w-full"}
              Name={"password"}
              Value={formData.password}
            />
            {/* <InputBox
              LabelName={"Login"}
              Placeholder={"Your Mobile Number"}
              Type={"number"}
              className={"w-full"}
            /> */}
            <Button
              className={`w-full bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
              label={"Login"}
              onClick={handleSubmit}
            />
          </form>
          <div className="w-full h-full justify-center items-center flex flex-col mt-20 lg:mt-0">
            <Button
              label={"Register Here"}
              onClick={NavigateRegister}
              className={`w-1/2 hover:bg-green-500 bg-white text-blue-600  hover:text-black`}
            />
            <p className="text-xs text-neutral-500 text-center">
              ** By continuing, you agree to our Terms of Use and Privacy
              Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingUI(Login);
