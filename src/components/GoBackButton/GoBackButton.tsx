import React from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Button, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import useGetResponsiveState from "../../utils/useGetResponsiveState";

interface Props {
  link: string;
}
export default function GoBackButton({ link }: Props): JSX.Element {
  const { smallScreenDisplay } = useGetResponsiveState();
  return (
    <Link to={link}>
      <Button size={smallScreenDisplay ? "small" : "medium"}>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" mr={0.5}>
            <ArrowBackIosIcon fontSize="small" />
          </Box>
          go back
        </Box>
      </Button>
    </Link>
  );
}
