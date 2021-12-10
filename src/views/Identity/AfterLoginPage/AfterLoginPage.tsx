import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../../context/UserContextProvider";
import { Roles } from "../../../interfaces/Roles";
import { MY_RESTAURANT, RESTAURANTS, SIGN_IN } from "../../../routing/paths";
import BaseLayout from "../../common/BaseLayout";

export default function AfterLoginPage(): JSX.Element {
  const { userRole, userId, initialUserLoading } = useContext(UserContext);

  if (!initialUserLoading) {
    if (!userId) {
      return <Redirect to={SIGN_IN} />;
    }
    if (userRole === Roles.CLIENT) {
      return <Redirect to={RESTAURANTS} />;
    }
    if (userRole === Roles.RESTAURANT) {
      return <Redirect to={MY_RESTAURANT} />;
    }
  }

  return (
    <BaseLayout loading menuEntries={[]}>
      <div />
    </BaseLayout>
  );
}
