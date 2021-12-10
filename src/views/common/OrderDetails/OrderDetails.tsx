import { Box, Button, Divider, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useContext, useEffect, useState, useCallback } from "react";

import { useHistory } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Order } from "../../../interfaces/Order";
import { Roles } from "../../../interfaces/Roles";
import { CURRENCY, DATE_FORMAT } from "../../../utils/consts";
import theme from "../../../utils/theme";
import useManageUrlQueryVariables from "../../../utils/useManageUrlQueryVariables";
import useChangeOrderStatus from "./useChangeOrderStatus";
import DisplayOrderStatus from "../../../components/DisplayOrderStatus/DisplayOrderStatus";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";

interface Props {
  goBackLink: string;
}
export default function OrderDetails({ goBackLink }: Props): JSX.Element {
  const history = useHistory();
  const { orderId } = useManageUrlQueryVariables();
  const { smallScreenDisplay } = useGetResponsiveState();
  const { setError } = useContext(ErrorContext);
  const { userId, userRole } = useContext(UserContext);

  const [order, setOrder] = useState<Order | null>(null);

  const {
    canOrderBeCanceled,
    canUserChangeStatus,
    cancelOrder,
    nextStatus,
    changeStatus,
  } = useChangeOrderStatus(orderId, order?.status);

  const checkIfUserIsAuth = useCallback(
    (restaurantOwnerId: string, clientId: string): boolean => {
      const isClient = userRole === Roles.CLIENT && userId === clientId;
      const isOwner = userRole === Roles.RESTAURANT && userId === restaurantOwnerId;
      if (!isClient && !isOwner) {
        return false;
      }
      return true;
    },
    [userId, userRole]
  );

  useEffect(() => {
    if (orderId && userId && userRole) {
      const orderRef = fireBaseDatabase.ref(`orders/${orderId}`);
      orderRef.on(
        "value",
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            const translatedVal: Order = {
              ...val,
              editHistory: val.editHistory ? Object.values(val.editHistory) : [],
            };
            const isAuth = checkIfUserIsAuth(
              translatedVal.restaurantOwnerId,
              translatedVal.clientId
            );
            if (!isAuth) {
              history.push(goBackLink);
            } else {
              setOrder(translatedVal);
            }
          }
        },
        (e) => {
          if (e) {
            setError("Error occured while getting order's data, please try again.");
          }
        }
      );
      return () => {
        orderRef.off();
      };
    }
  }, [checkIfUserIsAuth, goBackLink, history, orderId, setError, userId, userRole]);

  return (
    <Box mb={4}>
      <Box mb={smallScreenDisplay ? 1.5 : 3}>
        <GoBackButton link={goBackLink} />
      </Box>
      {order && (
        <>
          <Box
            display={smallScreenDisplay ? "block" : "flex"}
            justifyContent="space-between"
            mb={smallScreenDisplay ? 3 : 6}
          >
            <Box>
              <Box mb={1}>
                <Typography variant="caption">Your order:</Typography>
              </Box>
              <Typography variant="h5">{order.restaurantName}</Typography>
              <Typography variant="caption">
                {moment(order.createdAt).format(DATE_FORMAT)}
              </Typography>
              <DisplayOrderStatus status={order.status} small />
            </Box>
            <Box mt={smallScreenDisplay ? 2 : 0}>
              {canOrderBeCanceled && (
                <Button variant="outlined" onClick={(): Promise<void> => cancelOrder()}>
                  Cancel order
                </Button>
              )}
              {canUserChangeStatus && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems={smallScreenDisplay ? "flex-start" : "center"}
                >
                  <Box mb={smallScreenDisplay ? 0.5 : 1}>
                    <Typography variant="caption">Change order status:</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={(): Promise<void> => changeStatus()}
                  >
                    {nextStatus}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          <Box mb={6}>
            <Box mb={1}>
              <Typography variant="caption">Details:</Typography>
            </Box>
            <Box pl={1.5} mb={2}>
              {order.orderedMeals.map((omeal) => (
                <Box key={`orderDetails${omeal.id}`} mb={1} display="flex">
                  <Box mr={1}>
                    <Typography variant="body1">{omeal.count} x</Typography>
                  </Box>
                  <Box mr={2}>
                    <Typography variant="body1">{omeal.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      ={" "}
                      {`${Math.round(omeal.price * omeal.count * 100) / 100}${CURRENCY}`}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box mb={2}>
              <Divider />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography>Total: {`${order.totalPrice} ${CURRENCY}`}</Typography>
            </Box>
          </Box>
          <Box>
            <Box mb={1}>
              <Typography variant="caption">Order history:</Typography>
            </Box>
            <Box pl={smallScreenDisplay ? 0 : 1.5}>
              {order.editHistory &&
                order.editHistory.map((edit) => (
                  <Box
                    key={`editHistory${edit.timestamp}`}
                    pb={0.75}
                    mb={1.5}
                    borderBottom={`1px solid ${theme.palette.divider}`}
                  >
                    <Box display="flex" alignItems="center">
                      <Box mr={smallScreenDisplay ? 1 : 5}>
                        <Typography variant="body2">
                          {moment(edit.timestamp).format(DATE_FORMAT)}
                        </Typography>
                      </Box>
                      {edit.previousStatus ? (
                        <>
                          <DisplayOrderStatus status={edit.previousStatus} small />
                          <Box
                            mx={smallScreenDisplay ? 0.5 : 1.5}
                            display="flex"
                            alignItems="center"
                          >
                            <ArrowForwardIcon fontSize="small" />
                          </Box>
                          <DisplayOrderStatus status={edit.currentStatus} small />
                        </>
                      ) : (
                        <Typography variant="caption">Order created!</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
