import { EditHistoryEntry } from "./EditHistoryEntry";
import { OrderStatus } from "./OrderStatus";

export interface Order {
  createdAt: string;
  clientId: string;
  restaurantId: string;
  restaurantOwnerId: string;
  restaurantName: string;
  totalPrice: number;
  orderedMeals: OrderedMeal[];
  status: OrderStatus;
  editHistory?: EditHistoryEntry[];
}

export interface OrderedMeal {
  name: string;
  id: string;
  price: number;
  count: number;
}
export interface OrderWithId extends Order {
  id: string;
}
