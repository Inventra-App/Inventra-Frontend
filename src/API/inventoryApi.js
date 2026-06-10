import API from "./axios";

export const getInventoryItems = async () => {
  const res = await API.get("/admin/inventory");
  return res.data;
};

export const getExpiryAlerts = async () => {
  const res = await API.get("/admin/inventory/expiry-alerts");
  return res.data;
};

export const addInventoryItem = async (data) => {
  const res = await API.post("/admin/inventory/add", data);
  return res.data;
};

export const updateInventoryItem = async (id, data) => {
  const res = await API.put(`/admin/inventory/update/${id}`, data);
  return res.data;
};

export const deleteInventoryItem = async (id) => {
  const res = await API.delete(`/admin/inventory/delete/${id}`);
  return res.data;
};