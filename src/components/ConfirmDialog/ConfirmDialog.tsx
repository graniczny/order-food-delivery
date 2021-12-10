import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@material-ui/core";
import theme, { dangerColor } from "../../utils/theme";

interface Props {
  open: boolean;
  dialogTitle?: string;
  dialogContent?: string;
  onConfirm: () => void;
  onDecline: () => void;
  dangerButtonColor?: boolean;
}
export default function ConfirmDialog({
  open,
  onConfirm,
  onDecline,
  dialogContent,
  dialogTitle,
  dangerButtonColor,
}: Props): JSX.Element {
  return (
    <Dialog open={open} onClose={(): void => onDecline()}>
      <Box px={4} py={3}>
        {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
        {dialogContent && (
          <DialogContent>
            <DialogContentText>{dialogContent}</DialogContentText>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={(): void => onDecline()}>Decline</Button>
          <Button
            onClick={(): void => onConfirm()}
            style={{
              color: dangerButtonColor ? dangerColor : theme.palette.primary.main,
            }}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
