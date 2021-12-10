import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogProps,
  makeStyles,
} from "@material-ui/core";
import { black50Opacity } from "../../../utils/theme";

const useStyles = makeStyles({
  closeIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  },
  loading: {
    position: "absolute",
    bottom: 0,
    height: "100%",
    width: "100%",
    backgroundColor: black50Opacity,
    zIndex: 10,
  },
});

interface Props extends DialogProps {
  loading?: boolean;
  noCloseIcon?: boolean;
}

export default function CustomDialog(props: Props): JSX.Element {
  const classes = useStyles();
  const { children, onClose, loading, noCloseIcon } = props;
  const dialogProps = { ...props };
  delete dialogProps.loading;
  delete dialogProps.children;

  const handleCloseClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    if (onClose) {
      onClose(e, "escapeKeyDown");
    }
  };
  return (
    // eslint-disable-next-line
    <Dialog {...dialogProps}>
      <Box position="relative">
        {!noCloseIcon && (
          <CloseIcon className={classes.closeIcon} onClick={handleCloseClick} />
        )}
        {children}
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
    </Dialog>
  );
}
