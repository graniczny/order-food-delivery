import { Box, Button, Typography } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { OrderedMeal } from "../../../interfaces/Order";
import { CURRENCY } from "../../../utils/consts";
import theme from "../../../utils/theme";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";

interface Props {
  onPlaceOrder: () => void;
  orderedMeals: OrderedMeal[];
  totalPrice: number;
}
export default function OrderBar({
  onPlaceOrder,
  orderedMeals,
  totalPrice,
}: Props): JSX.Element {
  const [barExpanded, setBarExpanded] = useState(false);
  const { smallScreenDisplay } = useGetResponsiveState();

  return (
    <>
      {Boolean(orderedMeals.length) && (
        <Box
          width="100%"
          px={smallScreenDisplay ? 1 : 4}
          pb={smallScreenDisplay ? 1 : 2}
          pt={smallScreenDisplay ? 0.5 : 1.5}
          position="fixed"
          bottom="0"
          right="0"
          bgcolor="#fff"
          borderTop={`1px solid ${theme.palette.divider}`}
          boxSizing="border-box"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              onClick={(): void => setBarExpanded(!barExpanded)}
              size={smallScreenDisplay ? "small" : "medium"}
            >
              <Box display="flex" alignItems="center">
                <Box mr={smallScreenDisplay ? 0 : 1} display="flex" alignItems="center">
                  {barExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                <Typography>
                  {barExpanded ? "Show less" : "Display order details"}
                </Typography>
              </Box>
            </Button>

            <Box display="flex" alignItems="center">
              <Box mr={4}>
                <Typography>Total price: {totalPrice + CURRENCY}</Typography>
              </Box>
              <Button variant="outlined" onClick={() => onPlaceOrder()}>
                Order now!
              </Button>
            </Box>
          </Box>
          {barExpanded && (
            <Box py={2} pl={6}>
              {orderedMeals.map((omeal) => (
                <Box key={`orderBarMealDetail${omeal.id}`} mb={1} display="flex">
                  <Box mr={1}>
                    <Typography variant="body2">{omeal.count} x</Typography>
                  </Box>
                  <Box mr={2}>
                    <Typography variant="body2">{omeal.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      = {Math.round(omeal.price * omeal.count * 100) / 100 + CURRENCY}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
