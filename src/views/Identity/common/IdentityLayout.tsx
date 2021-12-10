import { Box, CircularProgress, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { PropsChild } from "../../../interfaces/PropsChild";
import { black50Opacity } from "../../../utils/theme";

interface Props extends PropsChild {
  loading?: boolean;
}

const useStyles = makeStyles({
  bg: {
    height: "100vh",
  },
  box: {
    backgroundColor: "#fff",
    width: "400px",
    maxHeight: "97vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  loading: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: black50Opacity,
    zIndex: 10,
  },
});

export default function IdentityLayout({ children, loading }: Props): JSX.Element {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={classes.bg}
    >
      <Box position="relative">
        <Box px={6} pt={4} pb={8} className={classes.box}>
          <Box display="flex" justifyContent="center" pb={5}>
            <Typography variant="h5">ToptalEats</Typography>
          </Box>
          {children}
        </Box>
        {loading && (
          <Box
            className={classes.loading}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}
