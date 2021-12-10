import { createMuiTheme } from "@material-ui/core/styles";

export const black15Opacity = "#40403f2c";
export const black50Opacity = "#40403f7c";
export const black100Opacity = "#40403F";

export const successColor = "#22B940";
export const successBackground = "#E3FCEF";

export const warningColor = "#d6a00d";
export const warningColorBackground = "#fff6df";

export const dangerColor = "#B00020";
export const dangerColorBackground = "#fd999269";

export const blueColor = "#1D8FE6";
export const blueColorBackground = "#DEEBFF";

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      root: {
        wordWrap: "break-word",
      },
    },
  },
});

theme.typography.body1 = {
  ...theme.typography.body1,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.875rem",
  },
};

theme.typography.body2 = {
  ...theme.typography.body2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
};

theme.typography.caption = {
  ...theme.typography.caption,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
  },
};

theme.typography.h6 = {
  ...theme.typography.h6,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem",
  },
};

export default theme;
