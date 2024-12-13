import React from "react";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";

const Login = () => {
  return (
    <div>
      <section className="flex m-28 border rounded-lg shadow-md shadow-neutral-300 h-96 ">
        <div className="w-1/2 p-10 rounded-lg rounded-r-none headerBg text-white">
          <h1 className="text-4xl h-3/4 text-white font-semibold">
            Login with your mobile number to get started !
          </h1>
          <h1>
            If you are not registered with us create your new account here
          </h1>
        </div>
        <div className=" w-1/2 flex justify-center items-center flex-col whiteSoftBG">
          <div className="login h-3/4 flex justify-top items-top flex-col w-3/4">
            <InputBox
              LabelName={"Login"}
              Placeholder={"Your Mobile Number"}
              Type={"number"}
              className={"w-full"}
            />
            <Button label={"Login"} className={"w-full"} />
          </div>
          <div className="w-full h-full justify-center items-center flex flex-col">
            <Button
              label={"Register Here"}
              className={"w-1/2 hover:bg-green-500"}
            />
            <p className="text-xs text-neutral-500">
              ** By continuing, you agree to Flipkart's Terms of Use and Privacy
              Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
