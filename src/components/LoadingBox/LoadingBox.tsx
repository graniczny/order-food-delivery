import { Box, CircularProgress } from "@material-ui/core";
import React from "react";

export default function LoadingBox(): JSX.Element {
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <CircularProgress />
    </Box>
  );
}
