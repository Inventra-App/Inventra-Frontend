import API from "./axios";

export const getTotalStockUnits = async () => {
  const res = await API.get("/dashboard/tsu");
  return res.data;
};

export const getTotalProductsCount = async () => {
  const res = await API.get("/dashboard/gtp"); 
  return res.data;
};

export const getAllProducts = async () => {
  const res = await API.get("/product/getAll"); 
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
  const res = await API.get("/i/all");
  return res.data;
};

export const addInventoryItem = async (payload) => {
  const res = await API.post("product", payload);
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

export const getAllCategories = async () => {
  const res = await API.get("allCategories");
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await API.get(`category/${id}`);
  return res.data;
};

export const addCategory = async (payload) => {
  const res = await API.post("category", payload);
  return res.data;
};

export const deleteCategory = async (categoryId) => {
  const res = await API.delete(`d/category/${categoryId}`);
  return res.data;
};

export const moveInventoryStock = async (inventoryId, payload) => {
  const res = await API.put(`p/move/${inventoryId}`, payload);
  return res.data;
};

export const recordStockEntry = async (payload) => {
  const res = await API.post("/stock/entry", payload);
  return res.data;
};