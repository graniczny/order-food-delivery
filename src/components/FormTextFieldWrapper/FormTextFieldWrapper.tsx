import Box from "@material-ui/core/Box";
import React from "react";
import { PropsChild } from "../../interfaces/PropsChild";

export default function FormTextFieldWrapper({ children }: PropsChild): JSX.Element {
  return <Box mb={3}>{children}</Box>;
}
