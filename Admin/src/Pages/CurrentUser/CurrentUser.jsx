import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";

const CurrentUser = () => {
  const { userId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [currentUserAddress, setCurrentUserAddress] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `users/admin/get-current-user/${userId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setCurrentUser(response.data.data.user);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    const fetchAllAddress = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `users/admin/${userId}/addresses`,
            "get"
          );
          console.log(response);
          if (response.statusText) {
            setCurrentUserAddress(response.data);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    fetchAllOrders();
    fetchAllAddress();
  }, [user]);

  console.log(currentUser);

  return (
    <div className="p-5">
      <div className="flex justify-center items-center gap-10 py-10">
        <Button label={"Ban User"} />
        <Button label={"Edit User"} />
        <div>
          <h1>
            User Id:{" "}
            <span className="text-xl font-bold">{currentUser?._id}</span>
          </h1>
        </div>
      </div>
      {/* <h1>current User</h1> */}
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Details
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Contact Number
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Account Created On
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Total Address Stored
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Total Orders
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Total Cart Products
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Total Wishlist Products
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.email}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.phoneNumber}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.createdAt}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.address?.length}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.totalOrders}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.CartProducts?.length}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentUser?.WishList?.length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentUser;
