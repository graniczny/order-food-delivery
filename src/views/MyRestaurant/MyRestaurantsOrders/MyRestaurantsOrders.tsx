import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Order, OrderWithId } from "../../../interfaces/Order";
import {
  MY_RESTAURANT,
  MY_RESTAURANT_ORDERS,
  PLACED_ORDER,
} from "../../../routing/paths";
import Orders from "../../common/Orders/Orders";

export default function MyRestaurantsOrders(): JSX.Element {
  const { userId } = useContext(UserContext);
  const [ordersData, setOrdersData] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const ordersRef = fireBaseDatabase
        .ref("orders")
        .orderByChild("restaurantOwnerId")
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
      orderBaseLink={MY_RESTAURANT + PLACED_ORDER}
      ordersListLink={MY_RESTAURANT + MY_RESTAURANT_ORDERS}
      loading={loading}
    />
  );
}
