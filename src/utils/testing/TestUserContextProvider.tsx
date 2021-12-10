import React, { createContext } from "react";

import { SignInChangeResponse, UserContextData } from "../../context/UserContextProvider";
import { PropsChild } from "../../interfaces/PropsChild";
import { Roles } from "../../interfaces/Roles";

interface Props extends PropsChild {
  userRole?: Roles;
  userEmail?: string;
  userId?: string;
  initialUserLoading?: boolean;
}

const signInWithEmailAndPasswordMock = (
  email: string,
  // eslint-disable-next-line
  pasword: string
): Promise<{ user?: string }> => {
  return new Promise((resolve, reject) => {
    if (email === "error@user.pl") {
      reject(new Error("Sign in error occured"));
    } else if (email === "notfound@user.pl") {
      resolve({});
    } else {
      resolve({ user: email });
    }
  });
};

const signIn = async (email: string, password: string): Promise<SignInChangeResponse> => {
  try {
    const res = await signInWithEmailAndPasswordMock(email, password);
    if (res.user) {
      return { success: true };
    }
    return { success: false };
  } catch (err) {
    return {
      error: err.message,
      success: false,
    };
  }
};

const logOut = (): any => {
  return { succes: true };
};

export const TestUserContext = createContext<UserContextData>({
  signIn,
  initialUserLoading: false,
  logOut,
});

export default function TestUserContextProvider({
  children,
  userEmail,
  userId,
  userRole,
  initialUserLoading,
}: Props): JSX.Element {
  const contextValue: UserContextData = {
    logOut,
    initialUserLoading: Boolean(initialUserLoading),
    signIn,
    userEmail,
    userId,
    userRole,
  };
  return (
    <TestUserContext.Provider value={contextValue}>{children}</TestUserContext.Provider>
  );
}
