import { Box, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import DisplayOrderStatus from "../../../components/DisplayOrderStatus/DisplayOrderStatus";
import ElevatedListItem from "../../../components/ElevatedListItem/ElevatedListItem";
import { OrderWithId } from "../../../interfaces/Order";
import { CURRENCY, DATE_FORMAT } from "../../../utils/consts";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";

interface Props {
  order: OrderWithId;
  onItemClick: () => void;
}
export default function OrderItem({ order, onItemClick }: Props): JSX.Element {
  const { smallScreenDisplay } = useGetResponsiveState();
  return (
    <ElevatedListItem onItemClick={onItemClick}>
      <>
        <Box width="40%">
          <Typography
            variant={smallScreenDisplay ? "body1" : "h6"}
            style={{ fontWeight: 600 }}
          >
            {order.restaurantName}
          </Typography>

          <DisplayOrderStatus status={order.status} small />
        </Box>

        <Box width="20%">
          <Typography variant="body2">
            Total: {`${order.totalPrice}${CURRENCY}`}
          </Typography>
        </Box>
        <Box width="20%">
          <Typography variant="body2">
            {moment(order.createdAt).format(DATE_FORMAT)}
          </Typography>
        </Box>
      </>
    </ElevatedListItem>
  );
}
