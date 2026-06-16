import API from "./axios";


export const signupAdmin = async (data) => {
  const res = await API.post("/user", data);
  console.log("=== RAW AXIOS RESPONSE OBJECT ===", res);
  return res.data;
};


export const verifySignupEmail = async (payload) => {
  const res = await API.post("/verify", payload);
  console.log("=== OTP VERIFICATION RAW RESPONSE ===", res);
  return res.data;
};

export const loginAdmin = async (data) => {
  const res = await API.post("/login", data);
  return res.data;
};

export const loginStaffs = async (data) =>{
  const res = await API.post("/staff/login")
}

export const resendOtp = async (email) => {
  const res = await API.post("/resend-otp", { email });
  return res.data;
};

export const forgetPassword = async (data) => {
  const res = await API.post("/forgot", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await API.post("/reset", data);
  return res.data;
};

export const verifyPasswordOtp = async (payload) => {
  const res = await API.post("/p/verify", payload);
  return res.data;
};


// Now edit this onboard staff in user management, change the username to email(it should accept only email) and remove the password input, 

// Then remove all the dummy data of hardcoded staffs in the user management and make the api call with the endpoint onboardStaff in usermanagementapi.js where I can add staffs too,

// Now call the api for staff login in login .jsx  with the endpoint in authAPi