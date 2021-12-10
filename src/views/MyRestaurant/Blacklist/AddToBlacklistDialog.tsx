import { Box, IconButton, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React, { useContext, useEffect, useState } from "react";
import CustomDialog from "../../../components/Dialog/CustomDialog/CustomDialog";
import CustomDialogContent from "../../../components/Dialog/CustomDialogContent/CustomDialogContent";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Roles } from "../../../interfaces/Roles";
import { UserData } from "../../../interfaces/UserData";
import usePaginationHook from "../../../utils/usePaginatiomHook";

interface Props {
  usersOnBlacklist: string[];
  ownerId: string;
  onClose: () => void;
}

interface UsersState {
  userId: string;
  email: string;
}

const addingToBlacklistError =
  "Error occured while adding user to blacklist, please try again.";

export default function AddToBlacklistDialog({
  onClose,
  usersOnBlacklist,
  ownerId,
}: Props): JSX.Element {
  const { setError } = useContext(ErrorContext);

  const [users, setUsers] = useState<UsersState[]>([]);

  const {
    currentPage,
    nextPage,
    nextPageButtonDisabled,
    paginatedData,
    previousPage,
    previousPageButtonDisabled,
  } = usePaginationHook<UsersState>(users);

  useEffect(() => {
    (async function getUsers() {
      try {
        const useresRef = fireBaseDatabase
          .ref("users")
          .orderByChild("role")
          .equalTo(Roles.CLIENT);
        const fetchedUsers = await useresRef.get();
        if (fetchedUsers.exists()) {
          const val = fetchedUsers.val();
          const translatedVal = Object.entries(val)
            .map(([userId, userData]) => ({
              userId,
              email: (userData as UserData).email,
            }))
            .filter((entry) => usersOnBlacklist.indexOf(entry.userId) === -1);
          setUsers(translatedVal);
        }
      } catch (err) {
        setError("Error occured while getting users, please try again.");
      }
    })();
  }, [setError, usersOnBlacklist]);

  const addUserToBlackList = async (userId: string, email: string): Promise<void> => {
    try {
      const ownerRef = fireBaseDatabase.ref(`blacklist/owners/${ownerId}`).push();
      await ownerRef.set({ userId, email });

      const userRef = fireBaseDatabase.ref(`blacklist/clients/${userId}`).push();
      await userRef.set({ ownerId });
      onClose();
    } catch (error) {
      setError(addingToBlacklistError);
    }
  };

  return (
    <CustomDialog open onClose={onClose} maxWidth="xs" fullWidth>
      <CustomDialogContent heading="Add user to blacklist">
        <>
          {paginatedData[currentPage] &&
            paginatedData[currentPage].map((u) => (
              <Box
                key={`blackListUser${u.userId}`}
                mb={1.5}
                display="flex"
                alignItems="center"
                style={{ cursor: "pointer" }}
                onClick={(): Promise<void> => addUserToBlackList(u.userId, u.email)}
              >
                <Box mr={1} display="flex" alignItems="center">
                  <AddCircleIcon fontSize="small" />
                </Box>
                <Typography>{u.email}</Typography>
              </Box>
            ))}
          {paginatedData && paginatedData[0]?.length === 0 && (
            <Typography>There are no more users to add to blacklist.</Typography>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" py={3}>
            <IconButton
              size="small"
              onClick={previousPage}
              disabled={previousPageButtonDisabled}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton size="small" onClick={nextPage} disabled={nextPageButtonDisabled}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </>
      </CustomDialogContent>
    </CustomDialog>
  );
}
