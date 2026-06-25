import API from "./axios";

export const changePassword = async (payload) => {
  const res = await API.patch("/user/change-password", payload);
  return res.data;
};

export const changeProfile = async (payload) => {
  const res = await API.patch("/user/profile", payload);
  return res.data;
};
