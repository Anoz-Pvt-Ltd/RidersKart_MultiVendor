import { LogIn, LogOut, User2 } from "lucide-react";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Button from "./Button";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);

  const Navigate = useNavigate();

  const NavigateLogin = () => {
    Navigate("/admin-login");
  };
  const NavigateToProfile = () => {
    Navigate(`/user-profile/dashboard/${user?.[0]?._id}`);
  };

  return (
    <header className="flex justify-between items-center mb-4 px-5 ">
      {/* Logo */}
      <div className="flex items-center">
        <Link to={"/"}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flipkart_logo.png/800px-Flipkart_logo.png"
            alt="Logo"
            className="h-8"
          />
        </Link>
      </div>
      <div className="flex items-center gap-5 px-4 py-5">
        {user.length ? (
          <div>
            <Button
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <User2 />
                  </span>
                  {user?.[0]?.name}
                </h1>
              }
              onClick={NavigateToProfile}
            />
          </div>
        ) : (
          <div>
            <Button
              label={
                <h1 className="flex  justify-start gap-2">
                  <span>
                    <LogIn />
                  </span>
                  Login{" "}
                </h1>
              }
              onClick={NavigateLogin}
            />
          </div>
        )}
        <Button
          label={
            <h1 className="flex  justify-start gap-2">
              <span>
                <LogOut />
              </span>
              Log Out{" "}
            </h1>
          }
          onClick={NavigateLogin}
        />
      </div>
    </header>
  );
};

export default Header;
