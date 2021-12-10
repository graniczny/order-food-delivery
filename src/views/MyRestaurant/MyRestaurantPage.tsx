import CancelIcon from "@material-ui/icons/Cancel";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import HelmetWrapper from "../../components/HelmetWrapper/HelmetWrapper";
import {
  CLIENTS_BLACKLIST,
  MY_RESTAURANT,
  MY_RESTAURANT_ORDERS,
  PLACED_ORDER,
  RESTAURANTS_SETTINGS,
  RESTAURANT_DETAILS,
} from "../../routing/paths";
import BaseLayout from "../common/BaseLayout";
import OrderDetails from "../common/OrderDetails/OrderDetails";
import Blacklist from "./Blacklist/Blacklist";
import MyRestaurantsOrders from "./MyRestaurantsOrders/MyRestaurantsOrders";
import RestaurantDetails from "./RestaurantDetails/RestaurantDetails";
import RestaurantsSettings from "./RestaurantsSettings/RestaurantsSettings";

export default function MyRestaurantPage(): JSX.Element {
  const menuEntries: { link: string; title: string; icon: JSX.Element }[] = [
    {
      link: MY_RESTAURANT + MY_RESTAURANT_ORDERS,
      title: "Orders",
      icon: <FastfoodIcon />,
    },
    {
      link: MY_RESTAURANT + RESTAURANTS_SETTINGS,
      title: "Restaurants settings",
      icon: <RestaurantMenuIcon />,
    },
    {
      link: MY_RESTAURANT + CLIENTS_BLACKLIST,
      title: "Clients blacklist",
      icon: <CancelIcon />,
    },
  ];
  return (
    <BaseLayout menuEntries={menuEntries}>
      <Switch>
        <Route
          path={MY_RESTAURANT}
          exact
          render={(): JSX.Element => (
            <Redirect to={MY_RESTAURANT + MY_RESTAURANT_ORDERS} />
          )}
        />
        <Route
          path={MY_RESTAURANT + RESTAURANTS_SETTINGS}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Restaurants settings">
              <RestaurantsSettings />
            </HelmetWrapper>
          )}
        />
        <Route
          path={MY_RESTAURANT + RESTAURANT_DETAILS}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Restaurant details">
              <RestaurantDetails />
            </HelmetWrapper>
          )}
        />
        <Route
          path={MY_RESTAURANT + MY_RESTAURANT_ORDERS}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Orders">
              <MyRestaurantsOrders />
            </HelmetWrapper>
          )}
        />
        <Route
          path={MY_RESTAURANT + PLACED_ORDER}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Order">
              <OrderDetails goBackLink={MY_RESTAURANT + MY_RESTAURANT_ORDERS} />
            </HelmetWrapper>
          )}
        />
        <Route
          path={MY_RESTAURANT + CLIENTS_BLACKLIST}
          render={(): JSX.Element => (
            <HelmetWrapper siteTitle="Blocked users">
              <Blacklist />
            </HelmetWrapper>
          )}
        />
      </Switch>
    </BaseLayout>
  );
}
