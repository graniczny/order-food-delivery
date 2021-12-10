import { useMediaQuery } from "@material-ui/core";
import theme from "./theme";

interface ReturnObject {
  smallScreenDisplay: boolean;
}

export default function useGetResponsiveState(): ReturnObject {
  const smallScreenDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  return {
    smallScreenDisplay,
  };
}
