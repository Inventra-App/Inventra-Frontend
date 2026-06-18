import API from "./axios"


export const contWithGoogle = async (data) => {
  const res = await API.post("/auth/google", data);
  return res.data;
};

export const googleAuthCallback = async (data) => {
  const res = await API.post("/auth/google/callback", data);
  return res.data;
};