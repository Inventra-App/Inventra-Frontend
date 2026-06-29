import API from "./axios";

export const getStaffs = async () => {
    console.log("Fetching staff...");
  const res = await API.get("/staff");
   console.log("Staff response:", res);
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
