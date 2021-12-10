import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorContextProvider from "./context/ErrorContextProvider";
import UserContextProvider from "./context/UserContextProvider";
import RouterComponent from "./routing/RouterComponent";
import theme from "./utils/theme";

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <ErrorContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <RouterComponent />
          </BrowserRouter>
        </UserContextProvider>
      </ErrorContextProvider>
    </ThemeProvider>
  );
}

export default App;
