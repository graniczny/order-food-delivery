import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { SIGN_IN } from "../../../routing/paths";
import TestsWrapper from "../../../utils/testing/TestsWrapper";
import SignUpPage from "./SignUpPage";

jest.mock("../../../firebase", () => {
  // eslint-disable-next-line
  const { mock } = require("../../../utils/testing/FirebaseMockObject");
  return mock;
});

describe("Sign up page tests", () => {
  afterEach(() => cleanup());
  test("renders site", () => {
    render(
      <TestsWrapper>
        <SignUpPage />
      </TestsWrapper>
    );
    const signUpText = screen.getByText(/Sign up/i);
    expect(signUpText).toBeInTheDocument();
  });

  test("redirects when form submited", async () => {
    let testLocation: any;
    const utils = render(
      <TestsWrapper>
        <>
          <SignUpPage />
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
    const emailInput = utils.getByPlaceholderText("Type your email") as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type new password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const repeatPasswordInput = utils.getByPlaceholderText(
      "Repeat password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(repeatPasswordInput, { target: { value: testPassword } });
    });
    expect(repeatPasswordInput.value).toBe(testPassword);

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

  test("display auth error when form submition fails", async () => {
    const utils = render(
      <TestsWrapper>
        <>
          <SignUpPage />
        </>
      </TestsWrapper>
    );

    const testEmail = "generate@error.pl";
    const emailInput = utils.getByPlaceholderText("Type your email") as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type new password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const repeatPasswordInput = utils.getByPlaceholderText(
      "Repeat password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(repeatPasswordInput, { target: { value: testPassword } });
    });
    expect(repeatPasswordInput.value).toBe(testPassword);

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const errorMsg = screen.getByText(/Auth error occured/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  test("display role error when form submition fails", async () => {
    const utils = render(
      <TestsWrapper>
        <>
          <SignUpPage />
        </>
      </TestsWrapper>
    );

    const testEmail = "generateRole@error.pl";
    const emailInput = utils.getByPlaceholderText("Type your email") as HTMLInputElement;
    act(() => {
      fireEvent.change(emailInput, { target: { value: testEmail } });
    });
    expect(emailInput.value).toBe(testEmail);

    const testPassword = "Password";
    const passwordInput = utils.getByPlaceholderText(
      "Type new password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(passwordInput, { target: { value: testPassword } });
    });
    expect(passwordInput.value).toBe(testPassword);

    const repeatPasswordInput = utils.getByPlaceholderText(
      "Repeat password"
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(repeatPasswordInput, { target: { value: testPassword } });
    });
    expect(repeatPasswordInput.value).toBe(testPassword);

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const errorMsg = screen.getByText(/Role error occured/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  test("display errors when form is empty", async () => {
    const utils = render(
      <TestsWrapper>
        <SignUpPage />
      </TestsWrapper>
    );

    const submitButton = utils.getByText("Submit");
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const requiredStringText = screen.getAllByText(/This field is required/i);
      expect(requiredStringText).toHaveLength(2);

      const requiredPasswordText = screen.getByText(/Password is required/i);
      expect(requiredPasswordText).toBeInTheDocument();
    });
  });

  test("display password errors when password is incorrect", async () => {
    const utils = render(
      <TestsWrapper>
        <SignUpPage />
      </TestsWrapper>
    );

    const passwordInput = utils.getByPlaceholderText(
      "Type new password"
    ) as HTMLInputElement;
    const submitButton = utils.getByText("Submit");

    // Too short password
    const tooShortPassword = "SHort";
    act(() => {
      fireEvent.change(passwordInput, { target: { value: tooShortPassword } });
    });
    expect(passwordInput.value).toBe(tooShortPassword);

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const minLengthStringText = screen.getByText("Min length of string equals: 6");
      expect(minLengthStringText).toBeInTheDocument();
    });

    // No uppercase password
    const noUpperCase = "password";
    act(() => {
      fireEvent.change(passwordInput, { target: { value: noUpperCase } });
    });
    expect(passwordInput.value).toBe(noUpperCase);

    act(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const noUpperCaseString = screen.getByText(
        "Password should contain at least one uppercase letter"
      );
      expect(noUpperCaseString).toBeInTheDocument();
    });

    // No lowercase password
    const noLowerCase = "PASSWORD";
    act(() => {
      fireEvent.change(passwordInput, { target: { value: noLowerCase } });
    });
    expect(passwordInput.value).toBe(noLowerCase);

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const noLowerCaseString = screen.getByText(
        "Password should contain at least one lowercase letter"
      );
      expect(noLowerCaseString).toBeInTheDocument();
    });
  });

  test("redirects when Sign in button clicked", async () => {
    let testLocation: any;
    const utils = render(
      <TestsWrapper>
        <>
          <SignUpPage />
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

    const signInPageButton = utils.getByText("Sign in page");
    act(() => {
      fireEvent.click(signInPageButton);
    });
    await waitFor(
      () => {
        expect(testLocation.pathname).toEqual(SIGN_IN);
      },
      { timeout: 100 }
    );
  });
});
