import { Meal } from "./Meal";

export interface RestaurantData {
  name: string;
  owner: string;
  description: string;
  meals?: { [key: string]: Meal };
}

export interface RestaurantDataWithId extends RestaurantData {
  id: string;
}
