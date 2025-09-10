// utils/filterProducts.js

export const FilterByPincode = (allProducts, userPostalCode, PinCodeData) => {
  if (!userPostalCode) return allProducts; // if no pincode, show all

  return allProducts.filter((product) => {
    const deliveryScope = product?.deliveryScope || "All India"; // fallback
    const deliveryStates = product?.deliveryStates || [];
    const deliveryCities = product?.deliveryCities || [];

    // ✅ Case 1: All India OR missing delivery info (old allProducts)
    if (deliveryScope === "All India" || !product.deliveryScope) {
      return true;
    }

    // ✅ Case 2: State-level delivery
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

    // ✅ Case 3: City-level delivery
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
};

export const checkPincodeAvailability = (product, pincode, pincodeData) => {
  const deliveryScope = product?.deliveryScope || "All India";
  const deliveryStates = product?.deliveryStates || [];
  const deliveryCities = product?.deliveryCities || [];

  // ✅ Case 1: All India OR old products (no scope)
  if (deliveryScope === "All India" || !product.deliveryScope) {
    return true;
  }

  // ✅ Case 2: State-level delivery
  if (deliveryScope === "state" && deliveryStates.length > 0) {
    for (let state of deliveryStates) {
      const cities = pincodeData[state];
      if (cities) {
        for (let city in cities) {
          if (cities[city].includes(pincode)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // ✅ Case 3: City-level delivery
  if (deliveryScope === "city" && deliveryCities.length > 0) {
    for (let city of deliveryCities) {
      for (let state in pincodeData) {
        if (
          pincodeData[state][city] &&
          pincodeData[state][city].includes(pincode)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  return false;
};
