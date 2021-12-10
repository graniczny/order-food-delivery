import FastfoodIcon from "@material-ui/icons/Fastfood";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import HelmetWrapper from "../../components/HelmetWrapper/HelmetWrapper";
import {
  MY_ORDER,
  RESTAURANTS,
  RESTAURANTS_LIST,
  RESTAURANT_PAGE,
  USER_ORDERS,
} from "../../routing/paths";
import BaseLayout from "../common/BaseLayout";
import OrderDetails from "../common/OrderDetails/OrderDetails";
import ClientsOrders from "./ClientsOrders/ClientsOrders";
import RestaurantHome from "./RestaurantHome/RestaurantHome";
import RestaurantsList from "./RestaurantsList/RestaurantsList";

export default function RestaurantsPage(): JSX.Element {
  const menuEntries: { link: string; title: string; icon: JSX.Element }[] = [
    {
      link: RESTAURANTS + RESTAURANTS_LIST,
      title: "Restaurants",
      icon: <RestaurantMenuIcon />,
    },
    {
      link: RESTAURANTS + USER_ORDERS,
      title: "My orders",
      icon: <FastfoodIcon />,
    },
  ];
  return (
    <BaseLayout menuEntries={menuEntries}>
      <Switch>
        <Route
          exact
          path={RESTAURANTS}
          render={(): JSX.Element => <Redirect to={RESTAURANTS + RESTAURANTS_LIST} />}
        />
        <Route
          path={RESTAURANTS + RESTAURANTS_LIST}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Restaurants list">
              <RestaurantsList />
            </HelmetWrapper>
          )}
        />
        <Route
          path={RESTAURANTS + RESTAURANT_PAGE}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Create order">
              <RestaurantHome />
            </HelmetWrapper>
          )}
        />
        <Route
          path={RESTAURANTS + USER_ORDERS}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Orders">
              <ClientsOrders />
            </HelmetWrapper>
          )}
        />
        <Route
          path={RESTAURANTS + MY_ORDER}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="My order">
              <OrderDetails goBackLink={RESTAURANTS + USER_ORDERS} />
            </HelmetWrapper>
          )}
        />
      </Switch>
    </BaseLayout>
  );
}
