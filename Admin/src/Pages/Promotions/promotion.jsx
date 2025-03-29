import React from "react";
import Button from "../../Components/Button";
import PopUp from "../../Components/PopUpWrapper";
import { useState, useRef } from "react";
import InputBox from "../../Components/InputBox";
import { FetchData } from "../../Utility/FetchFromApi";
import LoadingUI from "../../Components/Loading";

const Promotion = ({ startLoading, stopLoading }) => {
  const [popup, setPopup] = useState({
    addPromotion: false,
  });
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      // startLoading();
      const response = await FetchData("promotion/", "post", formData, true);

      console.log(response);
      alert("Added");
    } catch (err) {
      console.log(err);
    } finally {
      // stopLoading();
    }
  };

  return (
    <div>
      <Button
        label={"Add promotions"}
        onClick={() =>
          setPopup((prev) => {
            return { ...prev, addPromotion: true };
          })
        }
      />
      {popup?.addPromotion && (
        <PopUp
          onClose={() =>
            setPopup((prv) => {
              return { ...prv, addPromotion: false };
            })
          }
        >
          <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-center items-center ">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-4 gap-5"
            >
              <InputBox
                LabelName="Title"
                Type="text"
                Name="Title"
                Placeholder="Enter promotion title"
                Required={true}
              />
              <InputBox
                LabelName="Description"
                Type="text"
                Name="Description"
                Placeholder="Enter description"
                Required={true}
              />
              <InputBox
                LabelName="Discount (%)"
                Type="number"
                Name="Discount"
                Placeholder="Enter discount percentage"
                Required={true}
              />
              <InputBox
                LabelName="Start Date"
                Type="date"
                Name="StartDate"
                Required={true}
                Min={new Date().toISOString().split("T")[0]} // Restricts past dates
              />
              <InputBox
                LabelName="End Date"
                Type="date"
                Name="EndDate"
                Required={true}
                Min={new Date().toISOString().split("T")[0]} // Restricts past dates
              />
              <InputBox
                LabelName="Promo Code"
                Type="text"
                Name="PromoCode"
                Placeholder="Enter promo code"
                Required={true}
              />
              <InputBox
                LabelName="Minimum Purchase Amount"
                Type="number"
                Name="MinPurchase"
                Placeholder="Enter min purchase amount"
                Required={false}
              />
              <InputBox
                LabelName="Usage Limit"
                Type="number"
                Name="UsageLimit"
                Placeholder="No. of time users can use"
                Required={false}
              />
              <InputBox
                LabelName="User Eligibility"
                Type="text"
                Name="UserEligibility"
                Placeholder="Enter user eligibility"
                Required={false}
              />
              <InputBox
                LabelName="Image for Large Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
              <InputBox
                LabelName="Image for Medium Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
              <InputBox
                LabelName="Image for Small Devices"
                Type="file"
                Name="images"
                Placeholder="Upload Image"
                Required={true}
              />
            </form>
            <Button
              label={"Submit"}
              type={"submit"}
              onClick={handleSubmit}
              className={`h-fit w-fit`}
            />
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default LoadingUI(Promotion);
