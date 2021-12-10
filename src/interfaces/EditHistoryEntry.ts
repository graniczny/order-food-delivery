import { OrderStatus } from "./OrderStatus";

export interface EditHistoryEntry {
  timestamp: string;
  editorEmail: string;
  editorId: string;
  previousStatus?: OrderStatus;
  currentStatus: OrderStatus;
}
