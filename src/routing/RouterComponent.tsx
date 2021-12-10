import React from "react";
import { Switch, Route } from "react-router-dom";
import HelmetWrapper from "../components/HelmetWrapper/HelmetWrapper";
import { Roles } from "../interfaces/Roles";
import AfterLoginPage from "../views/Identity/AfterLoginPage/AfterLoginPage";
import SignInPage from "../views/Identity/SignIn/SignInPage";
import SignUpPage from "../views/Identity/SignUp/SignUpPage";
import MyRestaurantPage from "../views/MyRestaurant/MyRestaurantPage";
import RestaurantsPage from "../views/Restaurants/RestaurantsPage";
import { MY_RESTAURANT, RESTAURANTS, SIGN_IN, SIGN_UP } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

export default function RouterComponent(): JSX.Element {
  return (
    <Switch>
      <Route
        exact
        path={SIGN_IN}
        render={(): JSX.Element => (
          <HelmetWrapper siteTitle="Sign in">
            <SignInPage />
          </HelmetWrapper>
        )}
      />
      <Route
        exact
        path={SIGN_UP}
        render={(): JSX.Element => (
          <HelmetWrapper siteTitle="Sign up">
            <SignUpPage />
          </HelmetWrapper>
        )}
      />

      <Route
        path={RESTAURANTS}
        render={(): JSX.Element => (
          <ProtectedRoute userRole={Roles.CLIENT}>
            <HelmetWrapper siteTitle="Restaurants">
              <RestaurantsPage />
            </HelmetWrapper>
          </ProtectedRoute>
        )}
      />
      <Route
        path={MY_RESTAURANT}
        render={(): JSX.Element => (
          <ProtectedRoute userRole={Roles.RESTAURANT}>
            <HelmetWrapper siteTitle="My restaurant">
              <MyRestaurantPage />
            </HelmetWrapper>
          </ProtectedRoute>
        )}
      />

      <Route
        exact
        path="/"
        render={(): JSX.Element => (
          <ProtectedRoute>
            <AfterLoginPage />
          </ProtectedRoute>
        )}
      />
      <Route
        render={(): JSX.Element => (
          <ProtectedRoute>
            <AfterLoginPage />
          </ProtectedRoute>
        )}
      />
    </Switch>
  );
}
