import { Box, Button, Divider, TextField, Typography } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";
import ElevatedListItem from "../../../components/ElevatedListItem/ElevatedListItem";
import LoadingBox from "../../../components/LoadingBox/LoadingBox";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { QueryVariablesEnum } from "../../../interfaces/QueryVariables";
import { RestaurantData, RestaurantDataWithId } from "../../../interfaces/RestaurantData";
import { RESTAURANTS, RESTAURANT_PAGE } from "../../../routing/paths";
import useGetResponsiveState from "../../../utils/useGetResponsiveState";
import usePaginationHook from "../../../utils/usePaginatiomHook";

const fetchRestaurantsError =
  "Error occured while getting restaurants, please try again.";

export default function RestaurantsList(): JSX.Element {
  const history = useHistory();
  const { smallScreenDisplay } = useGetResponsiveState();
  const { setError } = useContext(ErrorContext);
  const { userId } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");

  const [restaurants, setRestaurants] = useState<RestaurantDataWithId[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantDataWithId[]>(
    []
  );
  const [blacklistedOwners, setBlacklistedOwners] = useState<string[] | null>(null);

  const {
    currentPage,
    nextPage,
    nextPageButtonDisabled,
    paginatedData,
    previousPage,
    previousPageButtonDisabled,
  } = usePaginationHook<RestaurantDataWithId>(filteredRestaurants);

  const generateFilteredRestaurants = useCallback(
    (restaurantsData: RestaurantDataWithId[], searchString: string): void => {
      let entries = [...restaurantsData];
      if (blacklistedOwners) {
        entries = entries.filter(
          (value) => blacklistedOwners.indexOf(value.owner) === -1
        );
      }
      if (searchString) {
        entries = entries.filter((value) =>
          value.name.toLowerCase().includes(searchString)
        );
      }
      setFilteredRestaurants(entries);
    },
    [blacklistedOwners]
  );

  useEffect(() => {
    if (userId) {
      (async function getBlackList() {
        try {
          const blackListRef = fireBaseDatabase.ref(`blacklist/clients/${userId}`);
          const blackListValue = await blackListRef.get();
          if (blackListValue.exists()) {
            const val = blackListValue.val();
            const ownersIds = Object.values(val).map(
              (value) => (value as { ownerId: string }).ownerId || ""
            );
            setBlacklistedOwners(ownersIds);
          } else {
            setBlacklistedOwners([]);
          }
        } catch (err) {
          setError(fetchRestaurantsError);
        }
      })();
    }
  }, [setError, userId]);

  useEffect(() => {
    (async function getRestaurants() {
      if (userId && blacklistedOwners) {
        try {
          const restaurantsRef = fireBaseDatabase.ref("restaurants");
          const restaurantRefValue = await restaurantsRef.get();
          if (restaurantRefValue.exists()) {
            const val = restaurantRefValue.val();
            const translatedVal = Object.entries(val).map(([id, restData]) => {
              const { description, name, owner, meals } = restData as RestaurantData;
              return {
                id,
                description,
                name,
                owner,
                meals,
              };
            });
            setRestaurants(translatedVal);
            generateFilteredRestaurants(translatedVal, "");
          }
        } catch (err) {
          setError(fetchRestaurantsError);
        }
        setLoading(false);
      }
    })();
  }, [blacklistedOwners, setError, generateFilteredRestaurants, userId]);

  const debouncedRestaurantFilter = useDebouncedCallback(
    (res: RestaurantDataWithId[], searchVal: string) => {
      generateFilteredRestaurants(res, searchVal);
    },
    400
  );

  const changeSearchValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
    debouncedRestaurantFilter(restaurants, e.target.value);
  };

  const onRestaurantClick = (restaurantId: string) => {
    history.push(
      `${RESTAURANTS}${RESTAURANT_PAGE}?${QueryVariablesEnum.RESTAURANTID}=${restaurantId}`
    );
  };

  return (
    <Box mb={3}>
      <Box mb={1}>
        <TextField
          value={searchValue}
          onChange={changeSearchValue}
          label="Search"
          placeholder="Restaurant name"
          variant="outlined"
          size="small"
          fullWidth={smallScreenDisplay}
        />
      </Box>
      <Box mb={2}>
        <Divider />
      </Box>
      {loading && <LoadingBox />}
      {paginatedData[currentPage] &&
        paginatedData[currentPage].map((resta) => (
          <ElevatedListItem
            key={`restaurantItem${resta.id}`}
            onItemClick={() => onRestaurantClick(resta.id)}
          >
            <Box>
              <Typography variant="h6">{resta.name}</Typography>
              <Typography variant="body2">{resta.description}</Typography>
            </Box>
          </ElevatedListItem>
        ))}
      {paginatedData?.[currentPage]?.length === 0 && (
        <Typography>No restaurants to display.</Typography>
      )}
      {Object.keys(paginatedData).length > 1 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" py={3}>
          <Button onClick={previousPage} disabled={previousPageButtonDisabled}>
            <NavigateBeforeIcon /> previous
          </Button>
          <Button onClick={nextPage} disabled={nextPageButtonDisabled}>
            next <NavigateNextIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
}
