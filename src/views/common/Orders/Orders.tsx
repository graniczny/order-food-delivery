import { Box, Button, Divider, makeStyles } from "@material-ui/core";
import React, { useMemo } from "react";
import { NavLink, Route, Switch } from "react-router-dom";
import { OrderWithId } from "../../../interfaces/Order";
import { OrderStatus } from "../../../interfaces/OrderStatus";
import { CANCELED_ORDER, FINISHED_ORDERS } from "../../../routing/paths";
import theme from "../../../utils/theme";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";
import OrdersList from "./OrdersList";

interface Props {
  loading: boolean;
  orders: OrderWithId[];
  orderBaseLink: string;
  ordersListLink: string;
}

const useStyles = makeStyles({
  activeLink: {
    "& .MuiButton-root": {
      color: `${theme.palette.primary.main}!important`,
    },
  },
  smallLink: {
    fontSize: "0.8rem",
  },
});

export default function Orders({
  orders,
  orderBaseLink,
  ordersListLink,
  loading,
}: Props): JSX.Element {
  const classes = useStyles();
  const { smallScreenDisplay } = useGetResponsiveState();

  const currentOrders = useMemo<OrderWithId[]>(() => {
    return orders.filter(
      (o) => o.status !== OrderStatus.RECEIVED && o.status !== OrderStatus.CANCELED
    );
  }, [orders]);

  const completedOrders = useMemo<OrderWithId[]>(() => {
    return orders.filter((o) => o.status === OrderStatus.RECEIVED);
  }, [orders]);

  const canceledOrders = useMemo<OrderWithId[]>(() => {
    return orders.filter((o) => o.status === OrderStatus.CANCELED);
  }, [orders]);

  return (
    <Box>
      <Box
        mb={1}
        display="flex"
        justifyContent={smallScreenDisplay ? "center" : "flex-start"}
      >
        <Box mr={smallScreenDisplay ? 1 : 3}>
          <NavLink to={ordersListLink} activeClassName={classes.activeLink} exact>
            <Button className={smallScreenDisplay ? classes.smallLink : undefined}>
              Current orders
            </Button>
          </NavLink>
        </Box>
        <Box mr={smallScreenDisplay ? 1 : 3}>
          <NavLink
            to={ordersListLink + FINISHED_ORDERS}
            activeClassName={classes.activeLink}
          >
            <Button className={smallScreenDisplay ? classes.smallLink : undefined}>
              Completed orders
            </Button>
          </NavLink>
        </Box>
        <Box mr={smallScreenDisplay ? 1 : 3}>
          <NavLink
            to={ordersListLink + CANCELED_ORDER}
            activeClassName={classes.activeLink}
          >
            <Button className={smallScreenDisplay ? classes.smallLink : undefined}>
              Canceled orders
            </Button>
          </NavLink>
        </Box>
      </Box>

      <Box mb={2}>
        <Divider />
      </Box>
      <Switch>
        <Route
          path={ordersListLink}
          exact
          render={(): JSX.Element => (
            <OrdersList
              orderBaseLink={orderBaseLink}
              orders={currentOrders}
              loading={loading}
            />
          )}
        />
        <Route
          exact
          path={ordersListLink + FINISHED_ORDERS}
          render={(): JSX.Element => (
            <OrdersList
              orderBaseLink={orderBaseLink}
              orders={completedOrders}
              loading={loading}
            />
          )}
        />
        <Route
          exact
          path={ordersListLink + CANCELED_ORDER}
          render={(): JSX.Element => (
            <OrdersList
              orderBaseLink={orderBaseLink}
              orders={canceledOrders}
              loading={loading}
            />
          )}
        />
      </Switch>
    </Box>
  );
}
