import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Box, CircularProgress } from "@material-ui/core";
import { SIGN_IN } from "./paths";
import { Roles } from "../interfaces/Roles";
import { UserContext } from "../context/UserContextProvider";
import { PropsChild } from "../interfaces/PropsChild";

interface Props extends PropsChild {
  userRole?: Roles;
}

export default function ProtectedRoute({ children, userRole }: Props): JSX.Element {
  const {
    userId,
    userRole: loggedUserRole,
    initialUserLoading,
  } = useContext(UserContext);

  if (!initialUserLoading) {
    if (!userId) return <Redirect to={SIGN_IN} />;
    if (userRole && loggedUserRole !== userRole) return <Redirect to="/" />;
    // eslint-disable-next-line
    return <>{children}</>;
  }
  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size={60} />
    </Box>
  );
}
