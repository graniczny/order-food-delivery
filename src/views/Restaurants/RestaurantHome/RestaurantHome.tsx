import { Box, Divider, IconButton, Paper, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import LoadingBox from "../../../components/LoadingBox/LoadingBox";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Meal, MealWithId } from "../../../interfaces/Meal";
import { Order, OrderedMeal } from "../../../interfaces/Order";
import { OrderStatus } from "../../../interfaces/OrderStatus";
import { QueryVariablesEnum } from "../../../interfaces/QueryVariables";
import { RestaurantData } from "../../../interfaces/RestaurantData";
import { MY_ORDER, RESTAURANTS, RESTAURANTS_LIST } from "../../../routing/paths";
import { CURRENCY } from "../../../utils/consts";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";
import useManageUrlQueryVariables from "../../../utils/useManageUrlQueryVariables";
import OrderBar from "./OrderBar";

export default function RestaurantHome(): JSX.Element {
  const { smallScreenDisplay } = useGetResponsiveState();
  const { restaurantId } = useManageUrlQueryVariables();
  const { userId, userEmail } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(true);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (restaurantId) {
      (async function getRestaurantData() {
        try {
          const restaurantRef = fireBaseDatabase.ref(`restaurants/${restaurantId}`);
          const restaurantVal = await restaurantRef.get();
          if (restaurantVal.exists()) {
            const val = restaurantVal.val();
            setRestaurantData(val as RestaurantData);
          }
        } catch (e) {
          setError("Error occured while fetching restaurant data.");
        }
        setLoading(false);
      })();
    }
  }, [restaurantId, setError]);

  useEffect(() => {
    if (restaurantData && userId && restaurantId && !order) {
      setOrder({
        clientId: userId,
        createdAt: "",
        orderedMeals: [],
        restaurantId,
        restaurantOwnerId: restaurantData.owner,
        restaurantName: restaurantData.name,
        status: OrderStatus.PLACED,
        totalPrice: 0,
        editHistory: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantData, restaurantId, userId]);

  const meals = useMemo<MealWithId[]>(() => {
    if (restaurantData?.meals) {
      return Object.entries(restaurantData.meals).map(([id, mealData]) => ({
        id,
        ...(mealData as Meal),
      }));
    }
    return [];
  }, [restaurantData]);

  const getMealOrderCount = useCallback(
    (mealId: string) => {
      if (order?.orderedMeals?.length) {
        const checkedMeal = order.orderedMeals.find((m) => m.id === mealId);
        if (checkedMeal) {
          return checkedMeal.count;
        }
      }
      return 0;
    },
    [order?.orderedMeals]
  );

  const calculateTotalCount = (acutalMeals: OrderedMeal[]) => {
    let total = 0;
    acutalMeals.forEach((m) => {
      total += m.price * m.count;
    });
    return Math.round(total * 100) / 100;
  };

  const removeItemFromOrder = (mealId: string) => {
    if (order?.orderedMeals?.length) {
      const changedMeals = order.orderedMeals
        .map((meal) => {
          if (meal.id === mealId) {
            return {
              ...meal,
              count: meal.count - 1,
            };
          }
          return meal;
        })
        .filter((m) => m.count > 0);

      setOrder({
        ...order,
        totalPrice: calculateTotalCount(changedMeals),
        orderedMeals: changedMeals,
      });
    }
  };

  const addItemToOrder = (meal: MealWithId) => {
    if (order?.orderedMeals) {
      const isAlreadyInOrder = order.orderedMeals.find((om) => om.id === meal.id);
      let changedMeals: OrderedMeal[] = order.orderedMeals;
      if (isAlreadyInOrder) {
        changedMeals = changedMeals.map((m) => {
          if (m.id === meal.id) {
            return {
              ...m,
              count: m.count + 1,
            };
          }
          return m;
        });
      } else {
        changedMeals.push({
          count: 1,
          id: meal.id,
          name: meal.name,
          price: meal.price,
        });
      }

      setOrder({
        ...order,
        totalPrice: calculateTotalCount(changedMeals),
        orderedMeals: changedMeals,
      });
    }
  };

  const onPlaceOrder = async (): Promise<void> => {
    if (order && userEmail && userId) {
      const createdAt = moment().toISOString();
      const orderValue: Order = {
        ...order,
        createdAt,
        editHistory: [
          {
            currentStatus: OrderStatus.PLACED,
            editorEmail: userEmail,
            editorId: userId,
            timestamp: createdAt,
          },
        ],
      };
      try {
        const ref = fireBaseDatabase.ref("orders").push();
        await ref.set(orderValue);
        history.push(
          `${RESTAURANTS + MY_ORDER}?${QueryVariablesEnum.ORDERID}=${ref.key}`
        );
      } catch (error) {
        setError("Error occured while creating new order, please try again.");
      }
    }
  };

  return (
    <Box pb={smallScreenDisplay ? 11 : 9}>
      <Box mb={3}>
        <GoBackButton link={RESTAURANTS + RESTAURANTS_LIST} />
      </Box>
      <Typography variant="h5">{restaurantData?.name}</Typography>
      <Box mb={4}>
        <Typography>{restaurantData?.description}</Typography>
      </Box>
      <Box>
        <Box mb={0.5}>
          <Typography variant="h6">Pick your meals</Typography>
        </Box>
        <Box mb={2}>
          <Divider />
        </Box>
        <Box>
          {loading && <LoadingBox />}
          {Boolean(meals.length) &&
            meals.map((meal) => (
              <Box key={`restaurantMeal${meal.id}`} mb={1}>
                <Paper>
                  <Box
                    px={2}
                    py={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box width="75%">
                      <Typography variant="h6">{meal.name}</Typography>
                      <Typography variant="body2">{meal.description}</Typography>
                      <Typography variant="body2">
                        Price: {`${meal.price} ${CURRENCY}`}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100px"
                    >
                      <IconButton onClick={(): void => removeItemFromOrder(meal.id)}>
                        <RemoveIcon />
                      </IconButton>
                      {getMealOrderCount(meal.id)}
                      <IconButton onClick={(): void => addItemToOrder(meal)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          {!meals.length && !loading && (
            <Typography>This restaurant has not any meal in offer.</Typography>
          )}
        </Box>
      </Box>
      {order && (
        <OrderBar
          onPlaceOrder={onPlaceOrder}
          orderedMeals={order.orderedMeals}
          totalPrice={order.totalPrice}
        />
      )}
    </Box>
  );
}
