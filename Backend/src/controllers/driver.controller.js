import { DeliveryPartner } from "../models/delivery-partner.model.js";
import { DriverVerificationStatus } from "../utils/AllStatus.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { UploadImages } from "../utils/imageKit.io.js";

const RegisterDriver = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    address,
    password,
    licenseNumber,
    aadharNumber,
    panNumber,
    physicallyDisabled,
    vehicleType,
    vehicleDescription,
    plateNumber,
    insuranceNumber,
    insuranceExpiry,
    vendorId,
  } = req.body;

  // Validate required fields
  if (
    [
      name,
      phone,
      address,
      password,
      licenseNumber,
      aadharNumber,
      panNumber,
      vehicleType,
      vehicleDescription,
      plateNumber,
      insuranceNumber,
      insuranceExpiry,
      vendorId,
    ].some((field) => field === undefined || field.toString().trim() === "")
  )
    throw new ApiError(400, "Required fields are missing.");

  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) throw new ApiError(404, "Vendor not found");

  if (!req.files || Object.keys(req.files).length < 7) {
    throw new ApiError(400, "Please upload all the images");
  }

  const uploadPromises = Object.entries(req.files).map(
    async ([fieldName, files]) => {
      // Assuming maxCount is 1, so files[0]
      const file = files[0];

      console.log(fieldName, files);
      const uploadedResult = await UploadImages(
        file.fileName,
        {
          folderStructure: `all-delivery-partners/${vendor.name.split(" ").join("-")}/${name.split(" ").join("-")}`,
        },
        [name, "delivery-partner", phone]
      ); // your cloud upload function
      return { [fieldName]: uploadedResult }; // return key-value pair
    }
  );

  // Wait for all uploads to complete
  const uploadedImagesArray = await Promise.all(uploadPromises).catch((error) =>
    console.error(error)
  );

  // Convert array of objects to a single merged object
  const uploadedImages = Object.assign({}, ...uploadedImagesArray);

  // Create a new driver object with validated data
  const newDriver = new DeliveryPartner({
    name,
    number: phone,
    address,
    password,
    drivingLicense: {
      number: licenseNumber,
      image: {
        url: uploadedImages.licenseImage.url,
        fileId: uploadedImages.licenseImage.fileId,
      },
    },
    aadhar: {
      number: aadharNumber,
      image: {
        url: uploadedImages.aadharImage.url,
        fileId: uploadedImages.aadharImage.fileId,
      },
    },
    pan: {
      number: panNumber,
      image: {
        url: uploadedImages.panImage.url,
        fileId: uploadedImages.panImage.fileId,
      },
    },

    physicallyDisabled: physicallyDisabled === "on" ? true : false || false,
    vehicleDetails: {
      vehicleType,
      plateNumber,
      vehicleDescription,
      RAC: {
        front: {
          url: uploadedImages.racFrontImage.url,
          fileId: uploadedImages.racFrontImage.fileId,
        },
        back: {
          url: uploadedImages.racBackImage.url,
          fileId: uploadedImages.racBackImage.fileId,
        },
      },
      insurance: {
        number: insuranceNumber,
        expiry: insuranceExpiry,
        image: {
          url: uploadedImages.insuranceImage.url,
          fileId: uploadedImages.insuranceImage.fileId,
        },
      },
      pollution: {
        url: uploadedImages.pollutionImage.url,
        fileId: uploadedImages.pollutionImage.fileId,
      },
    },
    vendorId: vendor._id,
    verificationStatus: DriverVerificationStatus[0],
  });

  // Save the driver to the database
  await newDriver.save();

  const createdDriver = await DeliveryPartner.findById(newDriver._id);

  if (!createdDriver)
    throw new ApiError(
      400,
      "Failed to register new Partner due to internal error! Please try again later."
    );

  // Respond with success
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdDriver,
        "Your application has been successfully submitted. We will inform you when its verified."
      )
    );
});

const GetActiveOrder = asyncHandler(async (req, res) => {
  const { driverId } = req.params;

  const driver =
    await DeliveryPartner.findById(driverId).populate("activeOrder");

  if (!driver) throw new ApiError(404, "Driver not found");

  if (!driver?.activeOrder)
    res
      .status(200)
      .json(
        new ApiResponse(200, "No active order found", "No active order found")
      );

  // io.emit(
  //   "allAppointments",
  //   new NotificationStructure(
  //     "All Appointments",
  //     `${driver?.name}, Here is your all appointments`,
  //     { allAppointments: "Vivek" }
  //   )
  // );

  res.status(200).json(new ApiResponse(200, driver.activeOrder, "Got it"));
});

const GetDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;

  if (!driverId) throw new ApiError(400, "Driver ID is required");

  const driver = await DeliveryPartner.findById(driverId);

  if (!driver) throw new ApiError(404, "Driver not found");

  res.status(200).json(new ApiResponse(200, driver, "Got it"));
});

const GetAllRegistrationRequests = asyncHandler(async (req, res) => {
  const requests = await DeliveryPartner.find({
    verificationStatus: "pending",
  }).populate("vendorId");

  if (!requests)
    res
      .status(201)
      .json(
        new ApiResponse(201, "No Request found", "Fetched all the requests")
      );

  res.status(200).json(new ApiResponse(200, requests, "Got all the requests"));
});

const GetAllVerifiedDrivers = asyncHandler(async (req, res) => {
  const drivers = await DeliveryPartner.find({
    verificationStatus: "verified",
  })
    .populate("vendorId")
    .populate("activeOrder");

  if (!drivers)
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "No Verified Driver found",
          "Fetched all the verified drivers"
        )
      );

  res
    .status(200)
    .json(new ApiResponse(200, drivers, "Got all the verified drivers"));
});

const AcceptRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  // console.log(requestId);
  if (!requestId)
    throw new ApiError(400, "Driver ID and Verification Status are required");

  const driver = await DeliveryPartner.findByIdAndUpdate(
    requestId,
    { verificationStatus: "verified" },
    { new: true }
  );

  if (!driver) throw new ApiError(404, "Driver not found!");

  res.status(200).json(new ApiResponse(200, driver, "Driver status updated"));
});

const RejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  if (!requestId)
    throw new ApiError(400, "Driver ID and Verification Status are required");
  const driver = await DeliveryPartner.findByIdAndUpdate(
    requestId,
    { verificationStatus: "rejected" },
    { new: true }
  );

  if (!driver) throw new ApiError(404, "Driver not found!");
  res.status(200).json(new ApiResponse(200, driver, "Driver status updated"));
});

const BanDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;

  const Partner = await DeliveryPartner.findByIdAndUpdate(
    driverId,
    {
      verificationStatus: "banned",
    },
    { new: true }
  );
  if (!Partner) throw new ApiError(404, "Partner not found");

  res.status(200).json(new ApiResponse(200, Partner, "User status updated"));
});

const DeleteDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  if (!driverId) throw new ApiError(400, "Partner ID is required");
  const Partner = await DeliveryPartner.findByIdAndDelete(driverId);
  if (!Partner) throw new ApiError(404, "Partner not found");
  res.status(200).json(new ApiResponse(200, "Partner deleted successfully"));
});

const ToggleSuspendDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  if (!driverId) throw new ApiError(400, "Partner ID is required");

  const partner = await DeliveryPartner.findById(driverId);
  if (!partner) throw new ApiError(404, "Partner not found");

  if (partner.verificationStatus === "suspended") {
    partner.verificationStatus = "verified";
    partner.isActive = true;
    await partner.save();
    res
      .status(200)
      .json(new ApiResponse(200, partner, "Partner Retrieved successfully"));
  } else {
    partner.verificationStatus = "suspended";
    partner.isActive = false;
  }

  await partner.save();

  res.status(200).json(new ApiResponse(200, partner, "Partner suspended"));
});

const ToggleActiveDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  if (!driverId) throw new ApiError(400, "Partner ID is required");

  const partner = await DeliveryPartner.findById(driverId);
  if (!partner) throw new ApiError(404, "Partner not found");

  if (partner.verificationStatus === "verified") {
    partner.isActive = !partner.isActive;
    await partner.save();
  } else {
    res
      .status(301)
      .json(new ApiResponse(301, "Driver is not eligible to be active"));
  }

  res.status(200).json(new ApiResponse(200, partner, "Partner status updated"));
});

export {
  RegisterDriver,
  GetActiveOrder,
  GetDriver,
  GetAllRegistrationRequests,
  GetAllVerifiedDrivers,
  AcceptRequest,
  RejectRequest,
  BanDriver,
  DeleteDriver,
  ToggleActiveDriver,
  ToggleSuspendDriver,
  // UpdateDriverAddress,
};
