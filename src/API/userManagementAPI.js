import API from  "./axios"

export const onBoardStaff = async () => {
  const res = await API.post("/create-staff"); 
  return res.data;
};