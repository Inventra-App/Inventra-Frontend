import API from "./axios";

export const makeSalesPos = async (payload) => {
  const salePayload = Array.isArray(payload?.items)
    ? payload
    : {
        items: [
          {
            id: payload?.id,
            quantity: payload?.quantity,
          },
        ],
      };

  const res = await API.post("pos/sale", salePayload);
  return res.data;
};

export const countSalesPos = async () => {
  const res = await API.get("sales");
  return res.data;
};
