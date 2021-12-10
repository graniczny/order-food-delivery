import React, { useEffect, useState, useContext } from "react";

import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { OrderWithId, Order } from "../../../interfaces/Order";
import { MY_ORDER, RESTAURANTS, USER_ORDERS } from "../../../routing/paths";
import Orders from "../../common/Orders/Orders";

export default function ClientsOrders(): JSX.Element {
  const { userId } = useContext(UserContext);
  const [ordersData, setOrdersData] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const ordersRef = fireBaseDatabase
        .ref("orders")
        .orderByChild("clientId")
        .equalTo(userId);
      ordersRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const translatedVal = Object.entries(val).map(([id, orderData]) => ({
            ...(orderData as Order),
            id,
          }));
          setOrdersData(translatedVal);
        }
        setLoading(false);
      });
      return () => {
        ordersRef.off();
      };
    }
  }, [userId]);

  return (
    <Orders
      orders={ordersData}
      orderBaseLink={RESTAURANTS + MY_ORDER}
      ordersListLink={RESTAURANTS + USER_ORDERS}
      loading={loading}
    />
  );
}
