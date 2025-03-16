import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../../Utility/Slice/UserInfoSlice";
import LoadingUI from "../../Components/Loading";

const AdminLogin = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      startLoading();
      const response = await FetchData(`admins/admin-login`, "post", formData);
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
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to Login.");
    } finally {
      stopLoading(); // Stop loading once response is received
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, Login yourself as Admin
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
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
        <div className="md:col-span-2">
          <Button label={"Login"} Type={"submit"} className={"w-full"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(AdminLogin);
