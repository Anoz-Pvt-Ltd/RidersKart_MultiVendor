import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const CurrentVerifiedVendor = ({ startLoading, stopLoading }) => {
  const { vendorId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentVendor, setCurrentVendor] = useState([]);
  const [currentVendorBankDetails, setCurrentVendorBankDetails] = useState([]);
  const [currentVendorBusinessDetails, setCurrentVendorBusinessDetails] =
    useState([]);
  const [currentVendorAddressDetails, setCurrentVendorAddressDetails] =
    useState([]);
  const [currentVendorProducts, setCurrentVendorProducts] = useState([]);

  useEffect(() => {
    const fetchVendor = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `vendor/admin/get-current-vendor/${vendorId}`,
            "get"
          );
          //   console.log(response);
          if (response.data.success) {
            setCurrentVendor(response.data.data.vendor);
            setCurrentVendorBankDetails(response.data.data.vendor.bankDetails);
            setCurrentVendorBusinessDetails(
              response.data.data.vendor.businessDetails
            );
            setCurrentVendorAddressDetails(response.data.data.vendor.location);
            setCurrentVendorProducts(response.data.data.vendor.products);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchVendor();
  }, [user]);

  const BankDetails = `${currentVendorBankDetails?.accountHolderName}, ${currentVendorBankDetails?.accountNumber}, ${currentVendorBankDetails?.bankName}, ${currentVendorBankDetails?.ifscCode}`;

  const fullAddress = `${currentVendorAddressDetails?.address}, ${currentVendorAddressDetails?.city}, ${currentVendorAddressDetails?.state}, ${currentVendorAddressDetails?.country}, ${currentVendorAddressDetails?.postalCode}`;

  const businessDetails = ` Business Name: ${currentVendorBusinessDetails?.businessName}, GST Number: ${currentVendorBusinessDetails?.gstNumber}`;

  const RejectRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `vendor/admin/reject-vendor/${vendorId}`,
        "get"
      );

      console.log(response);
      alert("Vendor rejected!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const AcceptRequest = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const response = await FetchData(
        `vendor/admin/accept-vendor/${vendorId}`,
        "get"
      );

      console.log(response);
      alert("Vendor Accepted!");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Vendor Details
      </h2>
      <h1>
        Vendor Id:{" "}
        <span className="text-2xl font-semibold">{currentVendor?._id}</span>
      </h1>
      <div className="flex justify-center items-center gap-20 mt-10">
        <Button label={"Delete Vendor"} />
        <Button label={"Ban Vendor"} />
        <Button label={"Accept Vendor"} onClick={AcceptRequest} />
        <Button label={"Reject Vendor"} onClick={RejectRequest} />
        {/* <Button label={"Cancel Order"} /> */}
      </div>
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Details
        </h2>
        <div className="space-y-4">
          {[
            { label: "Vendor id", value: currentVendor?._id },
            { label: "Contact Number", value: currentVendor?.contactNumber },
            { label: "Vendor Email", value: currentVendor?.email },
            { label: "Vendor Name", value: currentVendor?.name },
            {
              label: "Vendor Registered Products",
              value: currentVendorProducts?.length,
            },
            { label: "Store Location", value: fullAddress },
            {
              label: "Business Details",
              value: businessDetails,
            },
            { label: "Bank Details", value: BankDetails },
          ].map((item, index) => (
            <div key={index} className="flex">
              <span className="font-medium text-gray-600 w-1/3">
                {item.label}
              </span>
              <span className="text-xl font-medium text-gray-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentVerifiedVendor);
