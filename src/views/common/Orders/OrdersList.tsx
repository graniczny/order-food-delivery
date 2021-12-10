import { Box, Button, Typography } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React from "react";
import { useHistory } from "react-router-dom";
import LoadingBox from "../../../components/LoadingBox/LoadingBox";
import { OrderWithId } from "../../../interfaces/Order";
import { QueryVariablesEnum } from "../../../interfaces/QueryVariables";
import usePaginationHook from "../../../utils/usePaginatiomHook";
import OrderItem from "./OrderItem";

interface Props {
  loading: boolean;
  orders: OrderWithId[];
  orderBaseLink: string;
}
export default function OrdersList({
  orders,
  orderBaseLink,
  loading,
}: Props): JSX.Element {
  const history = useHistory();

  const {
    currentPage,
    nextPage,
    nextPageButtonDisabled,
    paginatedData,
    previousPage,
    previousPageButtonDisabled,
  } = usePaginationHook<OrderWithId>(orders);

  const onItemClick = (orderId: string): void => {
    history.push(`${orderBaseLink}?${QueryVariablesEnum.ORDERID}=${orderId}`);
  };

  return (
    <>
      {loading && <LoadingBox />}
      {!loading && !orders.length && (
        <Box>
          <Typography>No orders to display</Typography>
        </Box>
      )}
      {paginatedData[currentPage] &&
        paginatedData[currentPage].map((order) => (
          <OrderItem
            key={`orderItem${order.id}`}
            order={order}
            onItemClick={(): void => onItemClick(order.id)}
          />
        ))}

      {Object.keys(paginatedData).length > 1 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" py={3}>
          <Button onClick={previousPage} disabled={previousPageButtonDisabled}>
            <NavigateBeforeIcon /> previous
          </Button>
          <Button onClick={nextPage} disabled={nextPageButtonDisabled}>
            next <NavigateNextIcon />
          </Button>
        </Box>
      )}
    </>
  );
}
