import { Box, Button, Divider, Paper, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Meal, MealWithId } from "../../../interfaces/Meal";
import { MY_RESTAURANT, RESTAURANTS_SETTINGS } from "../../../routing/paths";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";
import useManageUrlQueryVariables from "../../../utils/useManageUrlQueryVariables";
import AddEditRestaurantDialog from "../AddEditRestaurantDialog/AddEditRestaurantDialog";
import { EditRestaurantData } from "../AddEditRestaurantDialog/EditRestaurantData";
import AddEditMealDialog from "./AddEditMealDialog";

interface RestaurantState {
  name: string;
  description: string;
  meals: MealWithId[];
}

const deleteMealError = "Error occured while deleting meal, please try again.";
const deleteRestaurantError =
  "Error occured while deleting restaurant, please try again.";

export default function RestaurantDetails(): JSX.Element {
  const { setError } = useContext(ErrorContext);
  const { restaurantId } = useManageUrlQueryVariables();
  const { smallScreenDisplay } = useGetResponsiveState();
  const history = useHistory();

  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantState | null>(
    null
  );
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false);
  const [editMeal, setEditMeal] = useState<MealWithId | null>(null);
  const [editRestaurant, setEditRestaurant] = useState<EditRestaurantData | null>(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<boolean>(false);

  useEffect(() => {
    const restaurantRef = fireBaseDatabase.ref(`restaurants/${restaurantId}`);
    restaurantRef.on(
      "value",
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const translatedVal = {
            ...val,
            meals:
              val.meals &&
              Object.entries(val.meals).map(([id, object]) => ({
                ...(object as Meal),
                id,
              })),
          } as RestaurantState;
          setRestaurantDetails(translatedVal);
        }
      },
      (e) => {
        if (e) {
          setError("Error occured while fetching restaurant data, please try again.");
        }
      }
    );

    return () => {
      restaurantRef.off();
    };
  }, [restaurantId, setError]);

  const onDeleteMeal = async (mealId: string) => {
    try {
      const mealRef = fireBaseDatabase.ref(`restaurants/${restaurantId}/meals/${mealId}`);
      await mealRef.remove();
    } catch (error) {
      setError(deleteMealError);
    }
  };

  const onDeleteRestaurant = async () => {
    try {
      const restRef = fireBaseDatabase.ref(`restaurants/${restaurantId}`);
      await restRef.remove();
      history.push(MY_RESTAURANT + RESTAURANTS_SETTINGS);
    } catch (error) {
      setError(deleteRestaurantError);
    }
  };

  const onEditRestaurant = () => {
    if (restaurantDetails && restaurantId) {
      const { description, name } = restaurantDetails;
      setEditRestaurant({
        description,
        name,
        id: restaurantId,
      });
    }
  };

  return (
    <Box>
      <Box
        mb={smallScreenDisplay ? 2 : 3}
        display={smallScreenDisplay ? "block" : "flex"}
        justifyContent="space-between"
      >
        <Box mb={smallScreenDisplay ? 1.5 : 0}>
          <GoBackButton link={MY_RESTAURANT + RESTAURANTS_SETTINGS} />
        </Box>
        <Box display="flex">
          <Box mr={1}>
            <Button
              variant="outlined"
              onClick={(): void => setDeleteConfirmDialog(true)}
              size={smallScreenDisplay ? "small" : "medium"}
            >
              Delete restaurant
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onEditRestaurant}
            size={smallScreenDisplay ? "small" : "medium"}
          >
            Edit restaurant
          </Button>
        </Box>
      </Box>
      <Typography variant="h5">{restaurantDetails?.name}</Typography>
      <Box mb={4}>
        <Typography>{restaurantDetails?.description}</Typography>
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Meals</Typography>
          <Button onClick={(): void => setAddMealDialogOpen(true)}>+ Add new meal</Button>
        </Box>
        <Box pb={2} pt={0.5}>
          <Divider />
        </Box>
        <Box>
          {restaurantDetails?.meals?.length &&
            restaurantDetails.meals.map((meal) => (
              <Box key={`restaurantMeal${meal.id}`} mb={1}>
                <Paper>
                  <Box
                    px={2}
                    py={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box width="70%">
                      <Typography variant="h6">{meal.name}</Typography>
                      <Typography variant="body2">{meal.description}</Typography>
                      <Typography variant="body2">Price: {meal.price}</Typography>
                    </Box>

                    <Box display={smallScreenDisplay ? "block" : "flex"}>
                      <Box
                        mr={smallScreenDisplay ? 0 : 1}
                        mb={smallScreenDisplay ? 0.5 : 0}
                      >
                        <Button
                          variant="contained"
                          onClick={(): void => setEditMeal(meal)}
                          color="primary"
                        >
                          Edit
                        </Button>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={(): Promise<void> => onDeleteMeal(meal.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
        </Box>
      </Box>
      <ConfirmDialog
        onConfirm={onDeleteRestaurant}
        onDecline={(): void => setDeleteConfirmDialog(false)}
        open={deleteConfirmDialog}
        dialogContent="Are you sure that you want to delete this restaurant?"
        dialogTitle="Confirm"
      />
      {addMealDialogOpen && restaurantId && (
        <AddEditMealDialog
          onClose={(): void => setAddMealDialogOpen(false)}
          restaurantId={restaurantId}
        />
      )}
      {editMeal && restaurantId && (
        <AddEditMealDialog
          onClose={(): void => setEditMeal(null)}
          restaurantId={restaurantId}
          mealData={editMeal}
        />
      )}
      {editRestaurant && restaurantId && (
        <AddEditRestaurantDialog
          onClose={(): void => setEditRestaurant(null)}
          restaurantData={editRestaurant}
        />
      )}
    </Box>
  );
}
