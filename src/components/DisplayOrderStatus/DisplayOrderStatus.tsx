import { Box, Typography } from "@material-ui/core";
import React from "react";
import { OrderStatus } from "../../interfaces/OrderStatus";
import getStatusColor from "../../utils/getStatusColor";
import theme from "../../utils/theme";

interface Props {
  status: OrderStatus;
  small?: boolean;
}
export default function DisplayOrderStatus({ status, small }: Props): JSX.Element {
  const { bgColor, textColor } = getStatusColor(status);
  return (
    <Box display="flex">
      <Box
        display="flex"
        px={1}
        py={0.1}
        bgcolor={bgColor}
        borderRadius={`${theme.shape.borderRadius}px`}
      >
        <Typography style={{ color: textColor }} variant={small ? "caption" : "body1"}>
          {status}
        </Typography>
      </Box>
    </Box>
  );
}
