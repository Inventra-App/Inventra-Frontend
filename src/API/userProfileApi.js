import API from "./axios";

export const getUserProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};
