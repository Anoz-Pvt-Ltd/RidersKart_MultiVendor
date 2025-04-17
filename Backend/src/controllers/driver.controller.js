import { DeliveryPartner } from "../models/delivery-partner.model.js";
import { DriverVerificationStatus } from "../utils/AllStatus.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { UploadImages } from "../utils/imageKit.io.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await DeliveryPartner.findById(userId);
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

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

const LoginDriver = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password)
    throw new ApiError(401, "phone and password are required");

  const user = await DeliveryPartner.findOne({ number: phone });

  if (!user) throw new ApiError(404, "Provided phone is not found");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");

  if (user.verificationStatus === DriverVerificationStatus[3])
    res
      .status(200)
      .json(new ApiResponse(200, {}, "You are Banned from our platform! 😤"));

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  if (user.verificationStatus === DriverVerificationStatus[2]) {
    user.isActive = true;
    await user.save();
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("RefreshToken", RefreshToken, options)
    .cookie("AccessToken", AccessToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user,
          tokens: {
            AccessToken,
            RefreshToken,
          },
        },
        "User Logged In successfully"
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
    verificationStatus: DriverVerificationStatus[0],
  });

  if (!requests)
    res
      .status(201)
      .json(
        new ApiResponse(201, "No Request found", "Fetched all the requests")
      );

  res.status(200).json(new ApiResponse(200, requests, "Got all the requests"));
});

const GetRegistrationRequests = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;
  if (!verificationId) throw new ApiError(400, "Verification ID is required");

  const request = await DeliveryPartner.findById(verificationId);
  if (!request) throw new ApiError(404, "Request not found");
  res.status(200).json(new ApiResponse(200, request, "Got the request"));
});

const GetAllVerifiedDrivers = asyncHandler(async (req, res) => {
  const drivers = await DeliveryPartner.find({
    verificationStatus: DriverVerificationStatus[2],
  });

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

const GetVerifiedPartner = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  if (!partnerId) throw new ApiError(400, "Partner ID is required");

  const partner = await DeliveryPartner.findById(partnerId);
  if (!partner) throw new ApiError(404, "Request not found");
  res.status(200).json(new ApiResponse(200, partner, "Got the Partner ID"));
});

const AcceptRequest = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;
  // console.log(verificationId);
  if (!verificationId)
    throw new ApiError(400, "Driver ID and Verification Status are required");

  const driver = await DeliveryPartner.findByIdAndUpdate(
    verificationId,
    { verificationStatus: DriverVerificationStatus[2] },
    { new: true }
  );

  if (!driver) throw new ApiError(404, "Driver not found!");

  res.status(200).json(new ApiResponse(200, driver, "Driver status updated"));
});

const PartnerBan = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const Partner = await DeliveryPartner.findById(partnerId);
  if (!Partner) throw new ApiError(404, "Partner not found");

  Partner.isBanned = !Partner.isBanned;
  Partner.save();
  res.status(200).json(new ApiResponse(200, Partner, "User status updated"));
});

const DeletePartner = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  if (!partnerId) throw new ApiError(400, "Partner ID is required");
  const Partner = await DeliveryPartner.findByIdAndDelete(partnerId);
  if (!Partner) throw new ApiError(404, "Partner not found");
  res.status(200).json(new ApiResponse(200, "Partner deleted successfully"));
});

const ToggleSuspendPartner = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  if (!partnerId) throw new ApiError(400, "Partner ID is required");

  const partner = await DeliveryPartner.findById(partnerId);
  if (!partner) throw new ApiError(404, "Partner not found");

  if (partner.verificationStatus === DriverVerificationStatus[4]) {
    partner.verificationStatus = DriverVerificationStatus[2];
    await partner.save();
    res
      .status(200)
      .json(new ApiResponse(200, partner, "Partner Retrieved successfully"));
  } else partner.verificationStatus = DriverVerificationStatus[4];

  await partner.save();

  res.status(200).json(new ApiResponse(200, partner, "Partner suspended"));
});

const ToggleActiveDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const { coordinates } = req.body;
  if (!driverId || !coordinates)
    throw new ApiError(400, "Driver ID and coordinates are required!!!");

  if (!Array.isArray(coordinates))
    throw new ApiError(400, "Address must be an array of coordinates");

  const driver = await DeliveryPartner.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  if (driver.verificationStatus === DriverVerificationStatus[2]) {
    console.log("Driver Active status: ", driver.isActive);
    driver.isActive = !driver.isActive;
    await driver.save();

    driver.currentLocation = {
      type: "Point",
      coordinates,
    };
    await driver.save();

    res.status(200).json(new ApiResponse(200, driver, "Driver status updated"));
  } else if (
    driver.verificationStatus === DriverVerificationStatus[0] ||
    driver.verificationStatus === DriverVerificationStatus[1]
  ) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          driver,
          "You are not verified yet! Please try to login again after verification"
        )
      );
  } else if (driver.verificationStatus === DriverVerificationStatus[4])
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          driver,
          "You id is suspended! Please try to login again after verification"
        )
      );
});

export {
  RegisterDriver,
  LoginDriver,
  GetActiveOrder,
  GetDriver,
  GetAllRegistrationRequests,
  GetAllVerifiedDrivers,
  AcceptRequest,
  GetRegistrationRequests,
  GetVerifiedPartner,
  PartnerBan,
  DeletePartner,
  ToggleActiveDriver,
  ToggleSuspendPartner,
  // UpdateDriverAddress,
};
