import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import theme, { black100Opacity } from "../../utils/theme";

interface Props {
  link: string;
  title: string;
  icon: JSX.Element;
  mobile?: boolean;
  onLinkClick: () => void;
}

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    textTransform: "uppercase",
    color: black100Opacity,
  },
  activeLink: {
    color: theme.palette.primary.main,
  },
});

export default function MenuItem({
  link,
  title,
  icon,
  mobile,
  onLinkClick,
}: Props): JSX.Element {
  const classes = useStyles();
  return (
    <NavLink
      className={classes.link}
      activeClassName={classes.activeLink}
      to={link}
      onClick={onLinkClick}
    >
      <Box mb={2.5} display="flex" alignItems="center">
        <Box mr={1}>{icon}</Box>
        <Typography variant={mobile ? "body2" : "body1"}>{title}</Typography>
      </Box>
    </NavLink>
  );
}
