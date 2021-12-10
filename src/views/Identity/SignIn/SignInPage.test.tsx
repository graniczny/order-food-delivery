import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { SIGN_UP } from "../../../routing/paths";
import TestsWrapper from "../../../utils/testing/TestsWrapper";
import SignInPage from "./SignInPage";

jest.mock("../../../context/UserContextProvider", () => {
  // eslint-disable-next-line
  const { TestUserContext } = require("../../../utils/testing/TestUserContextProvider");
  return { UserContext: TestUserContext };
});

describe("Sign in page tests", () => {
  afterEach(() => cleanup());

  test("renders site", () => {
    render(
      <TestsWrapper>
        <SignInPage />
      </TestsWrapper>
    );
    const signUpText = screen.getByText(/Sign in/i);
    expect(signUpText).toBeInTheDocument();
  });

  test("redirects when form submited", async () => {
    let testLocation: any;
    const utils = render(
      <TestsWrapper>
        <>
          <SignInPage />
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
    expect(testLocation.pathname).toBe("test");

    const testEmail = "some@email.pl";
    const emailInput = utils.getByPlaceholderText(
      "Type account's email address"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type your password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(
      () => {
        expect(testLocation.pathname).toEqual("/");
      },
      { timeout: 100 }
    );
  });

  test("display error when form submition fails", async () => {
    const utils = render(
      <TestsWrapper>
        <>
          <SignInPage />
        </>
      </TestsWrapper>
    );

    const testEmail = "error@user.pl";
    const emailInput = utils.getByPlaceholderText(
      "Type account's email address"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type your password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const errorMsg = screen.getByText(/Sign in error occured/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  test("display error when user is not found", async () => {
    const utils = render(
      <TestsWrapper>
        <>
          <SignInPage />
        </>
      </TestsWrapper>
    );

    const testEmail = "notfound@user.pl";
    const emailInput = utils.getByPlaceholderText(
      "Type account's email address"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type your password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const errorMsg = screen.getByText(/User not found/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  test("display errors when form is empty", async () => {
    const utils = render(
      <TestsWrapper>
        <SignInPage />
      </TestsWrapper>
    );

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const requiredStringText = screen.getAllByText(/This field is required/i);
      expect(requiredStringText).toHaveLength(2);
    });
  });

  test("redirects when CREATE NEW ACCOUNT button clicked", async () => {
    let testLocation: any;
    const utils = render(
      <TestsWrapper>
        <>
          <SignInPage />
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
    expect(testLocation.pathname).toBe("test");

    const signInPageButton = utils.getByText("Create new account");
    act(() => {
      fireEvent.click(signInPageButton);
    });
    await waitFor(
      () => {
        expect(testLocation.pathname).toEqual(SIGN_UP);
      },
      { timeout: 100 }
    );
  });
});
