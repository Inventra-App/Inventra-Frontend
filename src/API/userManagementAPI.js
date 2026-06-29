import API from "./axios";

export const getStaffs = async () => {
  const res = await API.get("/staff/login");
  return res.data;
};

export const onBoardStaff = async (payload) => {
  const res = await API.post("/create-staff", payload);
  return res.data;
};

export const loginStaff = async (payload) => {
  const res = await API.post("/staff/login", payload);
  return res.data;
};
