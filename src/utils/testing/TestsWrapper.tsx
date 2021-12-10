import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import ErrorContextProvider from "../../context/ErrorContextProvider";
import { PropsChild } from "../../interfaces/PropsChild";
import { Roles } from "../../interfaces/Roles";
import theme from "../theme";
import TestUserContextProvider from "./TestUserContextProvider";

interface Props extends PropsChild {
  userRole?: Roles;
  userEmail?: string;
  userId?: string;
  initialUserLoading?: boolean;
}
export default function TestsWrapper({
  userEmail,
  userId,
  userRole,
  children,
  initialUserLoading,
}: Props): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <ErrorContextProvider>
        <TestUserContextProvider
          userEmail={userEmail}
          userId={userId}
          userRole={userRole}
          initialUserLoading={initialUserLoading}
        >
          <MemoryRouter initialEntries={["test"]}>{children}</MemoryRouter>
        </TestUserContextProvider>
      </ErrorContextProvider>
    </ThemeProvider>
  );
}
