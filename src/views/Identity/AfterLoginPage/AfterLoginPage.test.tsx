import { cleanup, render, waitFor } from "@testing-library/react";
import React from "react";
import { Route } from "react-router-dom";
import { Roles } from "../../../interfaces/Roles";
import { MY_RESTAURANT, RESTAURANTS, SIGN_IN } from "../../../routing/paths";
import TestsWrapper from "../../../utils/testing/TestsWrapper";
import AfterLoginPage from "./AfterLoginPage";

jest.mock("../../../context/UserContextProvider", () => {
  // eslint-disable-next-line
  const { TestUserContext } = require("../../../utils/testing/TestUserContextProvider");
  return { UserContext: TestUserContext };
});

describe("After login page tests", () => {
  afterEach(() => cleanup());

  test("renders loader when initial loading", () => {
    render(
      <TestsWrapper initialUserLoading>
        <AfterLoginPage />
      </TestsWrapper>
    );
    const loader = document.querySelector("div.MuiCircularProgress-root");
    expect(loader).toBeVisible();
  });

  test("redirects to Sign in page when user doesnt exist", () => {
    let testLocation: any;
    render(
      <TestsWrapper userId="userId">
        <>
          <AfterLoginPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </>
      </TestsWrapper>
    );
    waitFor(() => {
      expect(testLocation.pathname).toBe(SIGN_IN);
    });
  });

  test("redirects to Client view when user has client role", () => {
    let testLocation: any;
    render(
      <TestsWrapper userId="userId" userRole={Roles.CLIENT} userEmail="user@email.pl">
        <>
          <AfterLoginPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </>
      </TestsWrapper>
    );
    waitFor(() => {
      expect(testLocation.pathname).toBe(RESTAURANTS);
    });
  });

  test("redirects to Restaurant view when user has restaurant tole", () => {
    let testLocation: any;
    render(
      <TestsWrapper userId="userId" userRole={Roles.RESTAURANT} userEmail="user@email.pl">
        <>
          <AfterLoginPage />
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </>
      </TestsWrapper>
    );
    waitFor(() => {
      expect(testLocation.pathname).toBe(MY_RESTAURANT);
    });
  });
});
