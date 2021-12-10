import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { PropsChild } from "../../interfaces/PropsChild";
import theme from "../../utils/theme";
import { UserContext } from "../../context/UserContextProvider";
import { ErrorContext } from "../../context/ErrorContextProvider";
import { SIGN_IN } from "../../routing/paths";
import Menu from "../../components/Menu/Menu";
import useGetResponsiveState from "../../utils/useGetResponsiveState";

interface Props extends PropsChild {
  loading?: boolean;
  menuEntries: { link: string; title: string; icon: JSX.Element }[];
}

const useStyles = makeStyles({
  topBar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
});

export default function BaseLayout({
  loading,
  children,
  menuEntries,
}: Props): JSX.Element {
  const classes = useStyles();
  const { smallScreenDisplay } = useGetResponsiveState();
  const history = useHistory();

  const { logOut, userEmail } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const onLogOut = async (): Promise<void> => {
    const res = await logOut();
    if (res.success) {
      history.push(SIGN_IN);
    }
    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <>
      <Box
        px={smallScreenDisplay ? 1.5 : 3}
        py={smallScreenDisplay ? 1 : 2}
        mb={smallScreenDisplay ? 2.5 : 4}
        className={classes.topBar}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {Boolean(menuEntries.length) && smallScreenDisplay && (
          <>
            <Box display="flex" alignItems="center">
              <MenuIcon onClick={(): void => setMenuDrawerOpen(true)} />
            </Box>
            <Drawer
              open={menuDrawerOpen}
              anchor="left"
              onClose={(): void => setMenuDrawerOpen(false)}
            >
              <Menu
                menuEntries={menuEntries}
                mobile
                onRouteChange={(): void => setMenuDrawerOpen(false)}
              />
            </Drawer>
          </>
        )}
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          ToptalEats
        </Typography>
        <Box>
          <Tooltip title={`Log out ${userEmail}`}>
            <IconButton onClick={onLogOut}>
              <ExitToAppIcon htmlColor="#fff" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Container>
        {loading ? (
          <Box p={5}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between">
            {!smallScreenDisplay && (
              <Box width="20%">
                <Menu menuEntries={menuEntries} />
              </Box>
            )}

            <Box width={smallScreenDisplay ? "100%" : "78%"}>{children}</Box>
          </Box>
        )}
      </Container>
    </>
  );
}
