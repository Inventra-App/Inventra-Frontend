import API from "./axios";

export const getTotalStockUnits = async () => {
  const res = await API.get("/dashboard/tsu");
  return res.data;
};

export const getTotalProductsCount = async () => {
  const res = await API.get("/dashboard/gtp"); 
  return res.data;
};

export const getTotalSalesAmount = async () => {
  const res = await API.get("/dashboard/tsa"); 
  return res.data;
};

export const getExpiryAlerts = async () => {
  const res = await API.get("/inventory/expiry-alerts");
  return res.data;
};

export const getInventoryItems = async () => {
  const res = await API.get("/product/getAll");
  return res.data;
};

export const addInventoryItem = async (payload) => {
  const res = await API.post("/inventory/product", payload);
  return res.data;
};

export const updateInventoryItem = async (id, data) => {
  const res = await API.put(`/inventory/product/${id}`, data);
  return res.data;
};

export const deleteInventoryItem = async (id) => {
  const res = await API.delete(`/inventory/product/${id}`);
  return res.data;
};