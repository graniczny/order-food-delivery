import { Box, Button, Divider, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ElevatedListItem from "../../../components/ElevatedListItem/ElevatedListItem";
import LoadingBox from "../../../components/LoadingBox/LoadingBox";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { QueryVariablesEnum } from "../../../interfaces/QueryVariables";
import { RestaurantData } from "../../../interfaces/RestaurantData";
import { MY_RESTAURANT, RESTAURANT_DETAILS } from "../../../routing/paths";
import AddEditRestaurantDialog from "../AddEditRestaurantDialog/AddEditRestaurantDialog";

interface RestaurantsState extends RestaurantData {
  id: string;
}

export default function RestaurantsSettings(): JSX.Element {
  const { userId } = useContext(UserContext);
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(true);
  const [restaurants, setRestaurants] = useState<RestaurantsState[]>([]);
  const [addRestaurantDialogOpen, setAddRestaurantDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const restaurantsRef = fireBaseDatabase
      .ref("restaurants")
      .orderByChild("owner")
      .equalTo(userId || null);
    restaurantsRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const translatedVal = Object.entries(val).map(([id, object]) => ({
          ...(object as RestaurantData),
          id,
        }));
        setRestaurants(translatedVal);
      }
      setLoading(false);
    });
    return () => {
      restaurantsRef.off();
    };
  }, [userId]);

  const onAddNewRestaurant = () => {
    setAddRestaurantDialogOpen(true);
  };

  const onRestaurantClick = (restaurantId: string) => {
    history.push(
      `${MY_RESTAURANT + RESTAURANT_DETAILS}?${
        QueryVariablesEnum.RESTAURANTID
      }=${restaurantId}`
    );
  };

  return (
    <Box mb={3}>
      <Box mb={2}>
        <Button variant="outlined" onClick={onAddNewRestaurant}>
          Add new restaurant
        </Button>
      </Box>
      <Box>
        <Typography variant="h6">My restaurants</Typography>
      </Box>
      <Box mb={2}>
        <Divider />
      </Box>
      {loading && <LoadingBox />}
      {restaurants.map((restaurant) => (
        <ElevatedListItem
          key={`restaurantSettingItem${restaurant.id}`}
          onItemClick={(): void => onRestaurantClick(restaurant.id)}
        >
          <Box>
            <Box>
              <Typography variant="h6">{restaurant.name}</Typography>
            </Box>
            <Box>
              <Typography variant="body2">{restaurant.description}</Typography>
            </Box>
          </Box>
        </ElevatedListItem>
      ))}
      {!loading && !restaurants.length && (
        <Typography>You have not any restaurant at this moment.</Typography>
      )}
      {addRestaurantDialogOpen && (
        <AddEditRestaurantDialog
          onClose={(): void => setAddRestaurantDialogOpen(false)}
        />
      )}
    </Box>
  );
}
