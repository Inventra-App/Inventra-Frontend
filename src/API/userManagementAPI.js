import API from "./axios";

export const getStaffs = async () => {
<<<<<<< HEAD
  const res = await API.get("/staff");
=======
  console.log("Fetching staff...");
  const res = await API.get("/staff");
  console.log("Staff response:", res);
>>>>>>> ec9be776d61f11a2c39bbd755a4d024d5a56d627
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

export const getSingleStaff = async (staffId) => {
  const res = await API.get(`/staff/${staffId}`);
  return res.data;
};

export const suspendStaff = async (staffId) => {
  const res = await API.patch(`/staff/suspend/${staffId}`);
  return res.data;
};

export const changeStaffRole = async (staffId, role) => {
  const res = await API.patch(`/staff/change-role/${staffId}`, {
    role,
  });
  return res.data;
};

export const resetStaffPassword = async (email) => {
  const res = await API.patch("/staff/change-password", {
    email,
  });
  return res.data;
};
