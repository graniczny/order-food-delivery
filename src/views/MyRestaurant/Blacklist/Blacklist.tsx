import { Box, Button, Divider, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import ElevatedListItem from "../../../components/ElevatedListItem/ElevatedListItem";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import AddToBlacklistDialog from "./AddToBlacklistDialog";

interface BlackListItem {
  userId: string;
  email: string;
  blackListId: string;
}

const removeFromBlacklistError =
  "Error occured while removing user from blacklist, pleae try again.";

export default function Blacklist(): JSX.Element {
  const { userId } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const [addToBlacklistDialogOpen, setAddToBlacklistDialogOpen] = useState(false);
  const [blackList, setBlackList] = useState<BlackListItem[] | null>(null);

  useEffect(() => {
    if (userId) {
      const blackListRef = fireBaseDatabase.ref(`blacklist/owners/${userId}`);

      blackListRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const translatedVal = Object.entries(val).map(([blackListId, userData]) => ({
            blackListId,
            email: (userData as any)?.email || "",
            userId: (userData as any)?.userId || "",
          }));
          setBlackList(translatedVal);
        } else {
          setBlackList(null);
        }
      });
      return () => {
        blackListRef.off();
      };
    }
  }, [userId]);

  const removeFromBlacklist = async (
    blacklistId: string,
    blacklistedUserId: string
  ): Promise<void> => {
    try {
      const blackRef = fireBaseDatabase.ref(`blacklist/owners/${userId}/${blacklistId}`);
      await blackRef.remove();

      const clientBlackList = fireBaseDatabase
        .ref(`blacklist/clients/${blacklistedUserId}`)
        .orderByChild("ownerId")
        .equalTo(userId || "");
      await clientBlackList.ref.remove();
    } catch (error) {
      setError(removeFromBlacklistError);
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Button
          onClick={(): void => setAddToBlacklistDialogOpen(true)}
          variant="outlined"
        >
          Add user to blacklist
        </Button>
      </Box>
      <Box>
        <Typography variant="h6">Blacklist</Typography>
      </Box>
      <Box mb={2}>
        <Divider />
      </Box>
      <Box>
        {blackList &&
          blackList.map((user) => (
            <ElevatedListItem key={`blackListItem${user.blackListId}`}>
              <>
                <Typography>{user.email}</Typography>
                <Button
                  onClick={(): Promise<void> =>
                    removeFromBlacklist(user.blackListId, user.userId)
                  }
                >
                  Remove
                </Button>
              </>
            </ElevatedListItem>
          ))}
        {!blackList?.length && (
          <Box>
            <Typography>No users on blacklist.</Typography>
          </Box>
        )}
      </Box>

      {addToBlacklistDialogOpen && (
        <AddToBlacklistDialog
          usersOnBlacklist={blackList ? blackList.map((u) => u.userId) : []}
          ownerId={userId || ""}
          onClose={(): void => setAddToBlacklistDialogOpen(false)}
        />
      )}
    </Box>
  );
}
