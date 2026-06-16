import API from "./axios";

// Sends the contact-us form data to the backend.
// `data` should be an object like:
//   { firstName, email, phoneNumber, message }
export const sendFeedBack = async (data) => {
  const res = await API.post("contact-us", data);
  return res.data;
};
