import API from "./axios";

export const makeSalesPos = async (payload) => {
  console.log(
    "SALE PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );

  const res = await API.post("pos/sale", payload);

  console.log("SALE RESPONSE:", res.data);

  return res.data;
};

export const countSalesPos = async () => {
  const res = await API.get("sales");
  return res.data;
};

export const getTotalSalesAmountPos = async () => {
  const res = await API.get("sale/amount");
  return res.data;
};

export const getSalesHistory = async (
  page = 1,
  limit = 10
) => {
  const res = await API.get(
    `sales?page=${page}&limit=${limit}`
  );

  return res.data;
};