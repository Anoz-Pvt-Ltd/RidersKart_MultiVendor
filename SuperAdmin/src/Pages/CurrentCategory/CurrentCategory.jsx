import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { Trash, Pencil } from "lucide-react";
import { useRef } from "react";
import InputBox from "../../components/InputBox";

const CurrentCategory = ({ startLoading, stopLoading }) => {
  const { categoryId } = useParams();
  const editSubcategoryFormRef = useRef(null);
  const SubcategoryFormRef = useRef(null);
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [CurrentCategory, setCurrentCategory] = useState();
  const [CurrentSubCategory, setCurrentSubCategory] = useState([]);
  const [handlePopup, setHandlePopup] = useState({
    addCategoryPopup: false,
    allCategoryPopup: false,
    allSubCategoryPopup: false,
    addSubCategory: false,
    editSubcategory: false,
    selectedSubcategoryId: null,
    selectedSubcategoryTitle: null,
  });
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", title: "", image: "" });

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `categories/get-category-by-id/${categoryId}`,
            "get"
          );
          if (response.data.success) {
            setCurrentCategory(response.data.data.category);
            setCurrentSubCategory(response.data.data.category.subcategories);
          } else {
            setError("Failed to load Categories.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch Categories."
          );
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllOrders();
  }, [user]);

  const submitSubcategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(SubcategoryFormRef.current);

    // for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
    // }
    try {
      startLoading();
      const response = await FetchData(
        `categories/sub-category/add`,
        "post",
        formData,
        true
      );
      // console.log(response);
      setHandlePopup((prev) => ({
        ...prev,
        addSubCategory: false,
      }));
      alert("Your Subcategory has been added successfully, kindly refresh !");
    } catch (err) {
      console.log(err);
      // alert(parseErrorMessage(err.response?.data));
      alert("Failed to add new Subcategory.");
    } finally {
      stopLoading();
    }
  };

  const handleDeleteSubcategory = async ({ subcategoryId }) => {
    // console.log(subcategoryId);
    try {
      startLoading();
      const response = await FetchData(
        `categories/sub-category/delete/${subcategoryId}`,
        "delete"
      );
      //   console.log(response);
      alert("Subcategory has been deleted successfully");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete Subcategory.");
    } finally {
      stopLoading();
    }
  };

  const handleEditSubcategory = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      startLoading();

      if (!handlePopup.selectedSubcategoryId) {
        alert("Subcategory ID is missing!");
        return;
      }

      const formData = new FormData(editSubcategoryFormRef.current);

      const response = await FetchData(
        `categories/edit-sub-category/${handlePopup.selectedSubcategoryId}`,
        "post",
        formData,
        true // Make sure your FetchData handles multipart/form-data when true
      );

      alert("Subcategory Edited Successfully!");
      window.location.reload(); // or update state without reload

      // Close popup and reset state
      setHandlePopup({
        editSubcategory: false,
        selectedSubcategoryId: null,
      });
    } catch (error) {
      console.error("Error editing subcategory:", error);
      alert("Failed to edit subcategory.");
    } finally {
      stopLoading();
    }
  };

  const handleOpenEditModal = (subcategory) => {
    setHandlePopup({
      editSubcategory: true,
      selectedSubcategoryId: subcategory._id,
    });
    setEditData({
      title: subcategory.title,
    });
  };

  const details = [
    { label: "Name", value: CurrentCategory?.title },
    {
      label: "Created At",
      value: new Date(CurrentCategory?.createdAt).toLocaleDateString(),
    },
    {
      label: "Updated At",
      value: new Date(CurrentCategory?.updatedAt).toLocaleDateString(),
    },
    { label: "Status", value: CurrentCategory?.status },
    { label: "Number of Subcategories", value: CurrentSubCategory?.length },
  ];
  return (
    <div className="">
      <div className="flex justify-center items-center gap-10 pb-5">
        {/* <Button label={"Ban User"} onClick={HandleUserBan} /> */}
        {/* <Button label={"Edit User"} /> */}
        <div className="flex justify-center items-center gap-20">
          <h1>
            Category Id: <span className="text-xl font-bold">{categoryId}</span>
          </h1>
          <Button
            label={"Add more Subcategory"}
            onClick={() =>
              setHandlePopup((prev) => {
                return { ...prev, addSubCategory: true };
              })
            }
          />
        </div>
      </div>
      {/* <h1>current User</h1> */}
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Categories Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 w-fit">
                <th className="border px-4 py-2 text-left text-gray-700">
                  Contents
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Information
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-gray-700 font-medium">
                    {item.label}
                  </td>
                  <td className="border px-4 py-2 text-gray-800">
                    {item.value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 ">
        <h1>
          All the Subcategories under{" "}
          <span className="font-semibold ">{CurrentCategory?.title}</span>
          {""} are listed below
        </h1>
        {CurrentSubCategory?.map((subcategory) => (
          <div
            key={subcategory.id}
            className="bg-white shadow m-5 rounded-xl p-4 flex justify-between items-center "
          >
            <div>
              <h2>
                <span className="font-semibold ">Subcategory Id: </span>
                {subcategory._id}
              </h2>
              <h2>
                <span className="font-semibold ">Name: </span>
                {subcategory.title}
              </h2>
              <h2>
                <span className="font-semibold ">Created at: </span>
                {new Date(subcategory.createdAt).toLocaleDateString()}
              </h2>
              <h2>
                <span className="font-semibold ">Last Updated at: </span>
                {new Date(subcategory.updatedAt).toLocaleDateString()}
              </h2>
            </div>
            <img src={subcategory.image.url} className="w-20 rounded-full " />
            <div className="flex justify-center items-center gap-5">
              <Button
                label={<Trash />}
                onClick={() =>
                  handleDeleteSubcategory({ subcategoryId: subcategory._id })
                }
              />
              <Button
                label={<Pencil />}
                onClick={() => handleOpenEditModal(subcategory)}
              />
            </div>
          </div>
        ))}
      </div>
      {handlePopup.editSubcategory && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full h-full">
          <form
            ref={editSubcategoryFormRef}
            onSubmit={handleEditSubcategory}
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative "
          >
            <h2 className="text-xl font-bold mb-4">Edit Subcategory</h2>

            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="newTitle"
              defaultValue={editData.title}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 text-sm font-medium">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                onClick={() =>
                  setHandlePopup({
                    editSubcategory: false,
                    selectedSubcategoryId: null,
                  })
                }
              />
              <Button type="submit" label="Update" />
            </div>
          </form>
        </div>
      )}
      {handlePopup.addSubCategory && (
        <div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0"
        >
          <div className="grayBG shadow-2xl rounded-xl w-fit h-fit px-10 py-10 flex justify-center items-center">
            <form
              ref={SubcategoryFormRef}
              onSubmit={submitSubcategory}
              className="flex flex-col gap-2 "
            >
              <h1>Add new Subcategory</h1>
              <InputBox
                LabelName={"Subcategory"}
                Placeholder={"New Subcategory"}
                Name={"subcategory"}
                Required
              />
              {/* {console.log(CurrentCategory)} */}
              <InputBox
                LabelName={"Category Id"}
                Value={CurrentCategory?._id}
                // Placeholder={CurrentCategory?._id}
                Name={"categoryId"}
                Required
              />
              {/* <InputBox
                  LabelName={"Sub Category"}
                  Placeholder={"Add Sub Category"}
                  Name={"subcategory"}
                  Required
                /> */}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Upload Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  // onChange={(e) =>
                  //   setImage(e.target.files[0])
                  // }
                />
              </div>
              <Button label={"Confirm"} type={"submit"} />
              <Button
                label={"Cancel"}
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, addSubCategory: false };
                  })
                }
                className={"hover:bg-red-500"}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(CurrentCategory);
