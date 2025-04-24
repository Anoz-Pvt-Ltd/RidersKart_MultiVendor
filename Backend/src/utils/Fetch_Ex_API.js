import axios from "axios";

export const FetchData = async (url, method, data) => {
  const Base_URL = `${process.env.RIDERS_KART_BASE_URL}/public/api/v1`;

  const options = {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.RIDERS_KART_API_KEY,
    },
    withCredentials: true,
  };

  if (method === "get") {
    const response = await axios.get(`${Base_URL}/${url}`, options);
    return response;
  } else if (method === "post") {
    const response = await axios.post(`${Base_URL}/${url}`, data, options);
    return response;
  } else if (method === "patch") {
    const response = await axios.patch(`${Base_URL}/${url}`, options);
    return response;
  } else if (method === "delete") {
    const response = await axios.delete(`${Base_URL}/${url}`, options);
    return response;
  } else {
    console.log(method);
    return "Please enter the valid method";
  }
};
