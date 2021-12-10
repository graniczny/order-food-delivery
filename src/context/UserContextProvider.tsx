import React, { createContext, useEffect, useState, useContext } from "react";

import { auth, fireBaseDatabase } from "../firebase";
import { PropsChild } from "../interfaces/PropsChild";
import { Roles } from "../interfaces/Roles";
import { ErrorContext } from "./ErrorContextProvider";

export interface SignInChangeResponse {
  error?: string;
  success?: boolean;
}
export interface UserContextData {
  userId?: string;
  userRole?: Roles;
  userEmail?: string;
  signIn: (email: string, password: string) => Promise<SignInChangeResponse>;
  logOut: () => Promise<SignInChangeResponse>;
  initialUserLoading: boolean;
}

const signIn = async (email: string, password: string): Promise<SignInChangeResponse> => {
  try {
    const res = await auth.signInWithEmailAndPassword(email, password);
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

export const UserContext = createContext<UserContextData>({
  signIn,
  initialUserLoading: true,
  logOut: () => new Promise((resolve) => resolve({ success: true })),
});

export default function UserContextProvider({ children }: PropsChild): JSX.Element {
  const { setError } = useContext(ErrorContext);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<Roles | undefined>(undefined);
  const [initialUserLoading, setInitialUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const sub = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUserId(user.uid);
          setUserEmail(user.email || undefined);
        } else if (userId) {
          setUserId(undefined);
          setUserEmail(undefined);
          setUserRole(undefined);
        }
        if (!user && initialUserLoading) {
          setInitialUserLoading(false);
        }
      },
      (e) => {
        if (e) {
          setError(e.message);
        }
      }
    );
    return sub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId) {
      const ref = fireBaseDatabase.ref(`users/${userId}`);
      ref.on(
        "value",
        (snapshot) => {
          if (snapshot.exists()) {
            const { role } = snapshot.val();
            setUserRole(role);
            if (initialUserLoading) {
              setInitialUserLoading(false);
            }
          }
        },
        (e) => {
          if (e) {
            setError(e.message);
          }
        }
      );

      return () => {
        ref.off();
      };
    }
  }, [initialUserLoading, setError, userId]);

  const logOut = async (): Promise<SignInChangeResponse> => {
    try {
      await auth.signOut();
      setUserId(undefined);
      setUserEmail(undefined);
      setUserRole(undefined);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        userEmail,
        userRole,
        signIn,
        initialUserLoading,
        logOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
