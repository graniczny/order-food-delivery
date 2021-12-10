import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { EditHistoryEntry } from "../../../interfaces/EditHistoryEntry";
import { OrderStatus } from "../../../interfaces/OrderStatus";
import { Roles } from "../../../interfaces/Roles";

interface ReturnObject {
  canUserChangeStatus: boolean;
  canOrderBeCanceled: boolean;
  changeStatus: () => Promise<void>;
  cancelOrder: () => Promise<void>;
  nextStatus: string;
}

type OrdersChangeMap = {
  [key in OrderStatus]?: {
    changeableBy?: Roles;
    nextStatus?: OrderStatus;
  };
};

const ordersChangeMap: OrdersChangeMap = {
  [OrderStatus.PLACED]: {
    changeableBy: Roles.RESTAURANT,
    nextStatus: OrderStatus.PROCESSING,
  },
  [OrderStatus.PROCESSING]: {
    changeableBy: Roles.RESTAURANT,
    nextStatus: OrderStatus.IN_ROUTE,
  },
  [OrderStatus.IN_ROUTE]: {
    changeableBy: Roles.RESTAURANT,
    nextStatus: OrderStatus.DELIVERED,
  },
  [OrderStatus.DELIVERED]: {
    changeableBy: Roles.CLIENT,
    nextStatus: OrderStatus.RECEIVED,
  },
};

const updateStatusError = "Error occured while updating order status, please try again.";

export default function useChangeOrderStatus(
  orderId?: string,
  orderStatus?: OrderStatus
): ReturnObject {
  const { setError } = useContext(ErrorContext);
  const { userId, userRole, userEmail } = useContext(UserContext);

  const [canOrderBeCanceled, setCanOrderBeCanceled] = useState(false);
  const [canUserChangeStatus, setCanUserChangeStatus] = useState(false);
  const [nextStatus, setNextStatus] = useState("");

  useEffect(() => {
    if (orderStatus && userRole) {
      if (userRole === Roles.CLIENT && orderStatus === OrderStatus.PLACED) {
        setCanOrderBeCanceled(true);
      } else {
        setCanOrderBeCanceled(false);
      }
    }
  }, [orderStatus, userRole]);

  useEffect(() => {
    if (orderStatus && userRole) {
      const statusChangeRules = ordersChangeMap[orderStatus];
      if (statusChangeRules && statusChangeRules.changeableBy === userRole) {
        setCanUserChangeStatus(true);
      } else {
        setCanUserChangeStatus(false);
      }
    }
  }, [orderStatus, userRole]);

  useEffect(() => {
    if (orderStatus && userRole) {
      setNextStatus(ordersChangeMap[orderStatus]?.nextStatus || "");
    }
  }, [orderStatus, userRole]);

  const cancelOrder = async (): Promise<void> => {
    if (canOrderBeCanceled) {
      try {
        const ref = fireBaseDatabase.ref(`orders/${orderId}`);
        await ref.update({
          status: OrderStatus.CANCELED,
        });

        const editHistoryNewRef = ref.child("editHistory").push();
        const newHistoryEntry: EditHistoryEntry = {
          currentStatus: OrderStatus.CANCELED,
          editorEmail: userEmail || "",
          editorId: userId || "",
          timestamp: moment().toISOString(),
          previousStatus: orderStatus,
        };
        await editHistoryNewRef.set(newHistoryEntry);
      } catch (error) {
        setError(updateStatusError);
      }
    }
  };

  const changeStatus = async (): Promise<void> => {
    if (canUserChangeStatus && orderStatus) {
      const previousStatus = orderStatus;
      const newStatus = ordersChangeMap[orderStatus]?.nextStatus;
      if (newStatus) {
        try {
          const ref = fireBaseDatabase.ref(`orders/${orderId}`);
          await ref.update({
            status: newStatus,
          });

          const editHistoryNewRef = ref.child("editHistory").push();
          const newHistoryEntry: EditHistoryEntry = {
            currentStatus: newStatus,
            editorEmail: userEmail || "",
            editorId: userId || "",
            timestamp: moment().toISOString(),
            previousStatus,
          };
          await editHistoryNewRef.set(newHistoryEntry);
        } catch (error) {
          setError(updateStatusError);
        }
      }
    }
  };

  return {
    canOrderBeCanceled,
    canUserChangeStatus,
    cancelOrder,
    changeStatus,
    nextStatus,
  };
}
