import mongoose from "mongoose";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/products.models.js";
import { Subcategory } from "../models/sub-category.model.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { User } from "../models/user.model.js";

// Controller to register a new product
const registerProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    subcategory,
    stockQuantity,
    sku,
    specifications,
    tags,
    brand,
    MRP,
    discount,
    deliveryScope,
    deliveryStates,
    deliveryCities,

    // NEW FIELDS
    productDimensions,
    productWeight,
  } = req.body;

  const vendorId = req.user._id;

  // Validate required fields
  if (
    !name ||
    !description ||
    !category ||
    !subcategory ||
    !stockQuantity ||
    !brand ||
    !sku ||
    !MRP ||
    !discount
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const allTags = tags ? tags.split(",") : [];

  // Validate category
  const existingCategory = await Category.findById(category);
  if (!existingCategory) throw new ApiError(400, "Invalid category selected");

  // Validate subcategory
  const existingSubCategory = await Subcategory.findById(subcategory);
  if (!existingSubCategory)
    throw new ApiError(400, "Invalid subcategory selected");

  // Check SKU
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    throw new ApiError(
      400,
      "This product might already be added! Try increasing the quantity."
    );
  }

  // Validate vendor
  const vendor = await VendorUser.findById(vendorId);
  if (!vendor) throw new ApiError(404, "Vendor not found");

  // Validate brand
  const checkBrand = await Brand.findById(brand);
  if (!checkBrand) throw new ApiError(404, "Brand not found");

  // MULTIPLE IMAGES FROM MULTER
  const images = req.files;

  if (!images || images.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  // Upload all images
  const uploadedImages = [];
  for (const image of images) {
    const uploaded = await UploadImages(
      image.filename,
      {
        folderStructure: `all-vendor/${vendor.name
          .split(" ")
          .join("-")}/${category.split(" ").join("-")}/${subcategory
          .split(" ")
          .join("-")}/${name.split(" ").join("-")}`,
      },
      tags,
      { description, category, subcategory }
    );

    uploadedImages.push({
      url: uploaded.url,
      altText: name,
      fileId: uploaded.fileId,
    });
  }

  // Validate delivery scope
  if (!["all", "state", "city"].includes(deliveryScope)) {
    throw new ApiError(400, "Invalid delivery scope");
  }

  // Create product
  const newProduct = new Product({
    name,
    description,
    category,
    subcategory,

    price: {
      MRP,
      sellingPrice: MRP - (MRP * discount) / 100,
      discount,
      discountedPrice: MRP - (MRP * discount) / 100,
    },

    stockQuantity,
    sku,
    images: uploadedImages,

    specifications: {
      details: `${specifications}`,
    },

    // ➕ NEW FIELDS
    productDimensions,
    productWeight,

    tags: allTags,
    vendor: vendorId,
    brand,

    deliveryScope,
    deliveryStates: deliveryScope === "state" ? deliveryStates : [],
    deliveryCities: deliveryScope === "city" ? deliveryCities : [],
  });

  await newProduct.save();

  // Add product to vendor collection
  vendor.products.push(newProduct._id);
  await vendor.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: newProduct },
        "Product added successfully"
      )
    );
});


const getAllProductForAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "title")
    .populate("subcategory", "title")
    .populate("vendor", "name email contactNumber")
    .populate("brand", "title logo")
    .sort({ createdAt: -1 });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  const response = new ApiResponse(
    200,
    products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

// const getAllProducts = asyncHandler(async (req, res) => {
//   try {
//     const {
//       category,
//       subcategory,
//       vendor,
//       page = 1,
//       limit = 10,
//       userCity,
//       userAddress,
//     } = req.query;
//     // const { userAddress } = req.params;

//     // console.log({ query: req.query, params: req.params, body: req.body });

//     // console.log("userCity", userCity);

//     if (userCity) {
//       const vendorsInCity = await VendorUser.find({
//         "location.city": userCity,
//       }).populate("products");
//       if (vendorsInCity || vendorsInCity.length > 0) {
//         const productsInCity = vendorsInCity.reduce((acc, vendor) => {
//           if (vendor.products && vendor.products.length > 0) {
//             acc.push(...vendor.products);
//           }
//           return acc;
//         }, []);
//         return res.status(200).json(
//           new ApiResponse(
//             200,
//             {
//               total: productsInCity.length,
//               page: 1,
//               limit: productsInCity.length,
//               products: productsInCity,
//             },
//             `Products fetched successfully for ${userCity}`
//           )
//         );
//       }
//     }

//     if (userAddress) {
//       const aggregationPipeline = [
//         // First, match products by category and subcategory (more efficient to do this first)
//         {
//           $match: {
//             category: mongoose.Types.ObjectId(category),
//             subcategory: mongoose.Types.ObjectId(subcategory),
//           },
//         },
//         // Then join with the VendorUser collection to access location data
//         {
//           $lookup: {
//             from: "VendorUser", // Make sure this matches your VendorUser collection name
//             localField: "vendor",
//             foreignField: "_id",
//             as: "vendorData",
//           },
//         },
//         // Unwind the vendorData array (since lookup returns an array)
//         {
//           $unwind: "$vendorData",
//         },
//         // Now filter by city
//         {
//           $match: {
//             "vendorData.location.city": userAddress,
//           },
//         },
//         // Optionally project only the fields you need
//         {
//           $project: {
//             name: 1,
//             description: 1,
//             price: 1,
//             stockQuantity: 1,
//             images: 1,
//             status: 1,
//             // Include other fields you need
//             "vendorData.location.city": 1,
//             "vendorData.location.address": 1,
//           },
//         },
//       ];

//       const filteredProducts = await Product.aggregate(aggregationPipeline);
//       return res.status(200).json({
//         success: true,
//         data: filteredProducts,
//       });
//     }

//     const filter = {};
//     if (category) filter.category = category;
//     if (subcategory) filter.subcategory = subcategory;
//     if (vendor) filter.vendor = vendor;

//     const products = await Product.find(filter)
//       .populate("category", "name")
//       .populate("subcategory", "name")
//       .populate("vendor", "name email")
//       .populate("brand")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     if (!products || products.length === 0) {
//       throw new ApiError(404, "No products found");
//     }

//     const totalProducts = await Product.countDocuments(filter);

//     const response = new ApiResponse(
//       200,
//       {
//         total: totalProducts,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         products,
//       },
//       "Products fetched successfully"
//     );

//     res.status(response.statusCode).json(response);
//   } catch (error) {
//     throw new ApiError(500, error.message || "Internal Server Error");
//   }
// });
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { category, subcategory, vendor, page = 1, limit = 100 } = req.query;
    const userId = req.user?._id;

    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (vendor) filter.vendor = vendor;

    let products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("vendor", "name email")
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!products || products.length === 0) {
      throw new ApiError(404, "No products found");
    }

    if (!userId) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            total: products.length,
            page: parseInt(page),
            limit: parseInt(limit),
            products,
          },
          "Products fetched successfully (no user filtering)"
        )
      );
    }

    const user = await User.findById(userId);
    if (!user || !user.defaultAddress || !user.defaultAddress.postalCode) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            total: products.length,
            page: parseInt(page),
            limit: parseInt(limit),
            products,
          },
          "Products fetched successfully (user has no default postal code)"
        )
      );
    }

    const userPostalCode = user.defaultAddress.postalCode;

    const filteredProducts = products.filter((product) => {
      const deliveryScope = product?.deliveryScope || "all";
      const deliveryStates = product?.deliveryStates || [];
      const deliveryCities = product?.deliveryCities || [];

      if (deliveryScope === "all" || !product.deliveryScope) return true;

      if (deliveryScope === "state" && deliveryStates.length > 0) {
        for (let state of deliveryStates) {
          const cities = PinCodeData[state];
          if (cities) {
            for (let city in cities) {
              if (cities[city].includes(userPostalCode)) {
                return true;
              }
            }
          }
        }
        return false;
      }

      if (deliveryScope === "city" && deliveryCities.length > 0) {
        for (let city of deliveryCities) {
          for (let state in PinCodeData) {
            if (
              PinCodeData[state][city] &&
              PinCodeData[state][city].includes(userPostalCode)
            ) {
              return true;
            }
          }
        }
        return false;
      }

      return false;
    });

    const response = new ApiResponse(
      200,
      {
        total: filteredProducts.length,
        page: parseInt(page),
        limit: parseInt(limit),
        products: filteredProducts,
      },
      "Products fetched successfully (postalCode filtered)"
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

const getProductsOfVendor = asyncHandler(async (req, res) => {
  // console.log("controller reached");
  const { vendorId } = req.params;

  if (!vendorId) throw new ApiError(400, "Vendor ID is required");
  console.log("vendorId: ", vendorId);

  // Fetch the products of the given vendor ID
  const vendor = await VendorUser.findById(vendorId).populate({
    path: "products",
    populate: [
      { path: "category" }, // Populate category inside products
      { path: "subcategory" }, // Populate subcategory inside products
      { path: "brand" }, // Populate subcategory inside products
    ],
  });

  if (!vendor) throw new ApiError(404, "Vendor not found");

  const response = new ApiResponse(
    200,
    vendor.products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Fetch the product by ID
  const product = await Product.findById(productId)
    .populate("category")
    .populate("subcategory")
    .populate("vendor")
    .populate("brand");

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // NEW: allow updating dimensions & weight safely
  const allowedUpdates = {
    ...updates,
    productDimensions: updates.productDimensions,
    productWeight: updates.productWeight,
  };

  const updatedProduct = await Product.findByIdAndUpdate(id, allowedUpdates, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});


const AddProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const images = req.files; // Array of uploaded images

  if (!productId) throw new ApiError(400, "Product ID is required");

  // Find the product by ID
  const product = await Product.findById(productId)
    .populate("vendor")
    .populate("category")
    .populate("subcategory");
  const { vendor, category, subcategory, name } = product;

  if (!product) throw new ApiError(404, "Product not found");

  // Upload each image and add to the product's images array
  for (const image of images) {
    const uploadedImage = await UploadImages(image.filename, {
      folderStructure: `all-vendor/${vendor.name.split(" ").join("-")}/${category.title.split(" ").join("-")}/${subcategory.title.split(" ").join("-")}/${name.split(" ").join("-")}`,
    });
    product.images.push({
      url: uploadedImage.url,
      altText: product.name,
      fileId: uploadedImage.fileId,
    });
  }

  // Save the updated product
  await product.save();

  res.status(200).json({
    success: true,
    message: "Images added successfully",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Delete the product
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

const markProductActive = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Update status
  product.status = "active";
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product marked as active successfully",
    product,
  });
});

// Mark product as suspended
const markProductSuspended = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Update status
  product.status = "suspended";
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product marked as suspended successfully",
    product,
  });
});

const getProductByCategory = asyncHandler(async (req, res) => {
  // console.log("Fetching products by category");

  const { category, subcategory, userAddress } = req.params;

  // Check if both category and subcategory are provided
  if (!category || !subcategory) {
    return res.status(400).json({
      success: false,
      message: "Category and subcategory are required.",
    });
  }

  console.log({ query: req.query, params: req.params, body: req.body });
  console.log("userAddress: ", userAddress);

  if (userAddress) {
    const aggregationPipeline = [
      // First, match products by category and subcategory (more efficient to do this first)
      {
        $match: {
          category: mongoose.Types.ObjectId(category),
          subcategory: mongoose.Types.ObjectId(subcategory),
        },
      },
      // Then join with the VendorUser collection to access location data
      {
        $lookup: {
          from: "VendorUser", // Make sure this matches your VendorUser collection name
          localField: "vendor",
          foreignField: "_id",
          as: "vendorData",
        },
      },
      // Unwind the vendorData array (since lookup returns an array)
      {
        $unwind: "$vendorData",
      },
      // Now filter by city
      {
        $match: {
          "vendorData.location.city": userAddress,
        },
      },
      // Optionally project only the fields you need
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          stockQuantity: 1,
          images: 1,
          status: 1,
          // Include other fields you need
          "vendorData.location.city": 1,
          "vendorData.location.address": 1,
        },
      },
    ];

    const filteredProducts = await Product.aggregate(aggregationPipeline);
    return res.status(200).json({
      success: true,
      data: filteredProducts,
    });
  }

  // Fetch the product by category and subcategory
  const products = await Product.find({
    category,
    subcategory,
  }).populate("brand");

  // Check if products are found
  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found for the selected category and subcategory.",
    });
  }

  // Return the found products
  return res.status(200).json({
    success: true,
    data: products,
  });
});

const addStockQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const quantityToAdd = Number(req.body.quantityToAdd); // Quantity to add to the stock
  console.log("Hello from controller line 357", productId, quantityToAdd);

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (quantityToAdd <= 0)
    throw new ApiError(400, "Quantity to add must be greater than zero");

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");

  // Add the quantity to the stock
  product.stockQuantity = product.stockQuantity + quantityToAdd;
  await product.save();

  const response = new ApiResponse(
    200,
    { stockQuantity: product.stockQuantity },
    "Stock quantity updated successfully"
  );
  res.status(response.statusCode).json(response);
});

// Controller to remove quantity from a product's stock
const removeStockQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const quantityToRemove = Number(req.body.quantityToRemove);

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (quantityToRemove <= 0)
    throw new ApiError(400, "Quantity to remove must be greater than zero");

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");

  // Ensure the quantity to remove is not more than the available stock
  if (product.stockQuantity < quantityToRemove) {
    throw new ApiError(
      400,
      "Insufficient stock to remove the specified quantity"
    );
  }

  // Remove the quantity from the stock
  product.stockQuantity -= quantityToRemove;
  await product.save();

  const response = new ApiResponse(
    200,
    { stockQuantity: product.stockQuantity },
    "Stock quantity updated successfully"
  );
  res.status(response.statusCode).json(response);
});

// Controller to show the current stock quantity of a product
const showAllStockQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) throw new ApiError(400, "Product ID is required");

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) throw new ApiError(404, "Product not found");

  const response = new ApiResponse(
    200,
    { stockQuantity: product.stockQuantity },
    "Stock quantity fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

// Search functionality
const searchProducts1 = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 15 } = req.query;
  const skip = (page - 1) * limit;

  if (!query || query.trim() === "") {
    const randomProducts = await Product.aggregate([
      { $match: { status: "active" } },
      { $sample: { size: 10 } },
    ]);
    return res.json({
      products: randomProducts,
      totalResults: randomProducts.length,
      currentPage: 1,
      totalPages: 1,
    });
  }

  // Step 1: Find exact matches first
  const exactMatches = await Product.find({
    status: "active",
    $text: { $search: `"${query}"` }, // Exact phrase match
  }).sort({ score: { $meta: "textScore" } });

  // Step 2: Find related products (even if we found exact matches)
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2);
  const regexPatterns = searchTerms.map((term) => new RegExp(term, "i"));

  const relatedQuery = {
    status: "active",
    $or: [
      { name: { $in: regexPatterns } },
      { description: { $in: regexPatterns } },
      { "specifications.details": { $in: regexPatterns } },
      { tags: { $in: searchTerms } },
    ],
  };

  // If we found exact matches, exclude them from related results
  if (exactMatches.length > 0) {
    relatedQuery._id = { $nin: exactMatches.map((p) => p._id) };
  }

  const relatedProducts = await Product.find(relatedQuery).limit(
    limit - exactMatches.length
  ); // Reserve space for exact matches

  // Combine results (exact matches first, then related products)
  const combinedResults = [...exactMatches, ...relatedProducts].slice(0, limit);
  const totalResults = combinedResults.length;

  // If no results found, return random products
  if (combinedResults.length === 0) {
    const randomProducts = await Product.aggregate([
      { $match: { status: "active" } },
      { $sample: { size: 10 } },
    ]);
    return res.json({
      products: randomProducts,
      totalResults: randomProducts.length,
      currentPage: 1,
      totalPages: 1,
    });
  }

  res.json({
    products: combinedResults,
    totalResults,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalResults / limit),
    hasNextPage: skip + limit < totalResults,
  });
});

const searchProducts = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!query || query.trim() === "") {
      const randomProducts = await getRandomProducts(10);
      return sendPaginatedResponse(
        res,
        randomProducts,
        1,
        randomProducts.length
      );
    }

    // Phase 1: Direct matches (exact and partial)
    const { exactMatches, partialMatches } = await getDirectMatches(query);
    const allDirectMatches = [...exactMatches, ...partialMatches];
    const foundProductIds = allDirectMatches.map((p) => p._id);

    // If no direct matches found, return random products
    if (allDirectMatches.length === 0) {
      const randomProducts = await getRandomProducts(limit);
      return sendPaginatedResponse(
        res,
        randomProducts,
        page,
        randomProducts.length
      );
    }

    // Phase 2: Get tags from matched products for expansion
    const expansionTags = await getExpansionTags(foundProductIds);

    // Phase 3: Get expanded results (from same categories/subcategories)
    const expandedMatches = await getExpandedMatches({
      excludeIds: foundProductIds,
      tags: expansionTags,
      categoryIds: [...new Set(allDirectMatches.map((p) => p.category))],
      subcategoryIds: [...new Set(allDirectMatches.map((p) => p.subcategory))],
      limit: limit - allDirectMatches.length,
    });

    // Combine and paginate results
    const allResults = [...allDirectMatches, ...expandedMatches];
    const paginatedResults = allResults.slice(skip, skip + limit);

    return sendPaginatedResponse(
      res,
      paginatedResults,
      page,
      allResults.length,
      limit
    );
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Server error during search",
      error: error.message,
    });
  }
};

// Helper functions
async function getDirectMatches(query) {
  // Get exact matches (phrase search)
  const exactMatches = await Product.find({
    status: "active",
    $text: { $search: `"${query}"` }, // Exact phrase match
  }).sort({ score: { $meta: "textScore" } });

  // Get partial matches if query has multiple words
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2);
  const regexPatterns = searchTerms.map((term) => new RegExp(term, "i"));

  const partialMatches =
    searchTerms.length > 1
      ? await Product.find({
          status: "active",
          _id: { $nin: exactMatches.map((p) => p._id) },
          $or: [
            { name: { $in: regexPatterns } },
            { description: { $in: regexPatterns } },
            { "specifications.details": { $in: regexPatterns } },
            { tags: { $in: searchTerms } },
          ],
        }).limit(20)
      : []; // Limit to prevent too many partial matches

  return { exactMatches, partialMatches };
}

async function getExpansionTags(productIds) {
  if (productIds.length === 0) return [];

  // Get most common tags from matched products
  const tagResults = await Product.aggregate([
    { $match: { _id: { $in: productIds } } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }, // Get top 5 most common tags
  ]);

  return tagResults.map((t) => t._id);
}

async function getExpandedMatches({
  excludeIds,
  tags,
  categoryIds,
  subcategoryIds,
  limit,
}) {
  if (tags.length === 0 || limit <= 0) return [];

  return await Product.find({
    status: "active",
    _id: { $nin: excludeIds },
    tags: { $in: tags },
    $or: [
      { category: { $in: categoryIds } },
      { subcategory: { $in: subcategoryIds } },
    ],
  })
    .sort({ createdAt: -1 }) // Show newer products first
    .limit(limit);
}

async function getRandomProducts(limit) {
  return await Product.aggregate([
    { $match: { status: "active" } },
    { $sample: { size: limit } },
  ]);
}

function sendPaginatedResponse(res, products, page, totalResults, limit = 20) {
  const totalPages = Math.ceil(totalResults / limit);

  return res.json({
    products,
    totalResults,
    currentPage: parseInt(page),
    totalPages,
    hasNextPage: page * limit < totalResults,
    searchStrategy:
      products.length > 0
        ? products[0]._score
          ? "direct"
          : "expanded"
        : "random",
  });
}

// Delete all products of a given vendor
// const deleteProductsByVendor = asyncHandler(async (req, res) => {
//   const { vendorId } = req.params;
//   console.log

//   if (!vendorId) {
//     throw new ApiError(400, "Vendor ID is required");
//   }

//   // Delete all products with this vendor ID
//   const result = await Product.deleteMany({ vendor: vendorId });

//   if (result.deletedCount === 0) {
//     throw new ApiError(404, "No products found for this vendor");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { deletedCount: result.deletedCount },
//         `${result.deletedCount} product(s) deleted successfully for vendor ${vendorId}`
//       )
//     );
// });
const deleteProductsByVendor = asyncHandler(async (req, res, next) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  // Find vendor
  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Check if vendor has products
  if (!vendor.products || vendor.products.length === 0) {
    throw new ApiError(404, "No products found under this vendor");
  }

  // Delete products from Product collection
  const result = await Product.deleteMany({ _id: { $in: vendor.products } });

  // Clear the vendor's products array
  vendor.products = [];
  await vendor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        `${result.deletedCount} product(s) deleted successfully from vendor ${vendorId}`
      )
    );
});

const productRating = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;
  const { rating, comment } = req.body;

  if (!productId) throw new ApiError(400, "Product ID not found!");
  if (!userId) throw new ApiError(400, "User not found");

  // find product
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // check if user has already rated
  const existingRating = product.ratings.find(
    (r) => r.user.toString() === userId
  );

  if (existingRating) {
    // update old rating
    existingRating.rating = rating;
    existingRating.comment = comment;
  } else {
    // push new rating
    product.ratings.push({ user: userId, rating, comment, product: productId });
  }

  await product.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, product.ratings, "Rating submitted successfully")
    );
});

const checkUserProductRating = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;

  if (!productId) throw new ApiError(400, "Product ID not provided");
  if (!userId) throw new ApiError(400, "User ID not provided");

  // find product with ratings
  const product = await Product.findById(productId).populate(
    "ratings.user",
    "name email"
  );

  if (!product) throw new ApiError(404, "Product not found");

  // check if user has rated
  const userRating = product.ratings.find((r) => r.user.toString() === userId);

  if (!userRating) {
    return res.status(200).json({
      success: true,
      hasRated: false,
      message: "User has not rated this product yet",
    });
  }

  return res.status(200).json({
    success: true,
    hasRated: true,
    rating: {
      rating: userRating.rating,
      comment: userRating.comment,
      createdAt: userRating.createdAt,
    },
  });
});

export {
  registerProduct,
  getAllProductForAdmin,
  getAllProducts,
  getProduct,
  editProduct,
  AddProductImages,
  deleteProduct,
  getProductsOfVendor,
  getProductByCategory,
  addStockQuantity,
  removeStockQuantity,
  searchProducts,
  deleteProductsByVendor,
  productRating,
  checkUserProductRating,
  markProductSuspended,
  markProductActive,
};
