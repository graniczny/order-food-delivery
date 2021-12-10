import { Box, Typography } from "@material-ui/core";
import React from "react";
import { PropsChild } from "../../../interfaces/PropsChild";

interface Props extends PropsChild {
  heading: string;
}

export default function CustomDialogContent({ children, heading }: Props): JSX.Element {
  return (
    <Box px={3} pt={4} pb={4} boxSizing="border-box">
      <Box mb={4}>
        <Typography variant="h5">{heading}</Typography>
      </Box>
      {children}
    </Box>
  );
}
