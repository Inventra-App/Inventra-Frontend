import { z } from "zod";

export const inventoryItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  batchNumber: z.string().min(1, "Batch number code is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  expiryDate: z.string().min(1, "Expiry date selection is required"),
  status: z.enum(["EXPIRED", "CRITICAL", "HEALTHY"]).default("HEALTHY"),
});