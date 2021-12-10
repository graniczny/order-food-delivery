import { Snackbar } from "@material-ui/core";
import React, { createContext, useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { PropsChild } from "../interfaces/PropsChild";

export interface ErrorContextData {
  setError: (msg?: string) => void;
}

const baseErrorMsg = "Error occured, please try again.";

// eslint-disable-next-line
export const ErrorContext = createContext<ErrorContextData>({ setError: () => {} });

export default function ErrorContextProvider({ children }: PropsChild): JSX.Element {
  const [errorMsg, setErrorMsg] = useState<string>("");

  const setError = (msg?: string) => {
    setErrorMsg(msg || baseErrorMsg);
  };

  const clearError = () => setErrorMsg("");

  return (
    <ErrorContext.Provider value={{ setError }}>
      <>
        {children}
        {Boolean(errorMsg) && (
          <Snackbar open onClose={clearError}>
            <MuiAlert onClose={clearError} severity="error" elevation={6}>
              {errorMsg}
            </MuiAlert>
          </Snackbar>
        )}
      </>
    </ErrorContext.Provider>
  );
}
