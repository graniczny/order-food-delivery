import { Box, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { PropsChild } from "../../interfaces/PropsChild";
import { black15Opacity } from "../../utils/theme";
import useGetResponsiveState from "../../utils/useGetResponsiveState";

interface Props extends PropsChild {
  onItemClick?: () => void;
}

const useStyles = makeStyles({
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: black15Opacity,
    },
  },
});

export default function ElevatedListItem({ children, onItemClick }: Props): JSX.Element {
  const { smallScreenDisplay } = useGetResponsiveState();
  const classes = useStyles();

  return (
    <Box mb={1}>
      <Paper className={classes.listItem}>
        <Box
          px={smallScreenDisplay ? 1 : 2}
          py={1.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={onItemClick}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
