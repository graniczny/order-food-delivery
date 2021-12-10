import { OrderStatus } from "../interfaces/OrderStatus";
import {
  blueColor,
  blueColorBackground,
  dangerColor,
  dangerColorBackground,
  successBackground,
  successColor,
  warningColor,
  warningColorBackground,
} from "./theme";

interface Colors {
  bgColor: string;
  textColor: string;
}

const statusColorMap = {
  [OrderStatus.CANCELED]: {
    bgColor: dangerColorBackground,
    textColor: dangerColor,
  },
  [OrderStatus.DELIVERED]: {
    bgColor: successBackground,
    textColor: successColor,
  },
  [OrderStatus.IN_ROUTE]: {
    bgColor: warningColorBackground,
    textColor: warningColor,
  },
  [OrderStatus.PROCESSING]: {
    bgColor: warningColorBackground,
    textColor: warningColor,
  },
  [OrderStatus.PLACED]: {
    bgColor: blueColorBackground,
    textColor: blueColor,
  },
  [OrderStatus.RECEIVED]: {
    bgColor: successBackground,
    textColor: successColor,
  },
};

export default function getStatusColor(status: OrderStatus): Colors {
  return statusColorMap[status];
}
