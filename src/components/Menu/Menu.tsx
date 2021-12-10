import { Box, Typography } from "@material-ui/core";
import React from "react";
import MenuItem from "./MenuItem";

interface Props {
  menuEntries: { link: string; title: string; icon: JSX.Element }[];
  mobile?: boolean;
  onRouteChange?: () => void;
}

export default function MyRestaurantMenu({
  menuEntries,
  mobile,
  onRouteChange,
}: Props): JSX.Element {
  const onLinkClick = () => {
    if (onRouteChange) {
      onRouteChange();
    }
  };
  return (
    <Box px={mobile ? 4 : 2} pt={mobile ? 4 : 0}>
      <Box mb={3}>
        <Typography variant="h5">Navigate</Typography>
      </Box>
      {menuEntries.map(({ link, title, icon }) => (
        <MenuItem
          key={`menuItem${link}`}
          link={link}
          title={title}
          icon={icon}
          mobile
          onLinkClick={onLinkClick}
        />
      ))}
    </Box>
  );
}
