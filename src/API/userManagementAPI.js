import API from "./axios";

export const getStaffs = async () => {
  const res = await API.get("/staff");
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

export const activateStaff = async (staffId) => {
  const res = await API.patch(`/staff/activate/${staffId}`);
  return res.data;
};

export const deleteStaff = async (staffId) => {
  const res = await API.delete(`/staff/${staffId}`);
  return res.data;
};
