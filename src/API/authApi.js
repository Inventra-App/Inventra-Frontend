import API from "./axios";

export const signupAdmin = async (data) => {
  const res = await API.post("/admin/signUp", data);
  return res.data;
};

export const verifySignupEmail = async (data) => {
  const res = await API.post("/admin/verifyEmail", data);
  return res.data;
};

export const loginAdmin = async (data) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};

export const resendOtp = async (email) => {
  const res = await API.post("/admin/resendOTP", { email });
  return res.data;
};

export const forgetPassword = async (data) => {
  const res = await API.post("/admin/forget-password", data);
  return res.data;
};

export const forgetPasswordOTP = async (data) => {
  const res = await API.post("/admin/verify-forget-password", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await API.post("/admin/reset-password", data);
  return res.data;
};