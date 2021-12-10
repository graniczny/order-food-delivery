import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, makeStyles, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import FormTextFieldWrapper from "../../../components/FormTextFieldWrapper/FormTextFieldWrapper";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { SIGN_UP } from "../../../routing/paths";
import { emailValidator, requiredStringValidator } from "../../../utils/formValidators";
import IdentityLayout from "../common/IdentityLayout";

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: emailValidator,
  password: requiredStringValidator,
});

const useStyles = makeStyles({
  link: {
    display: "block",
    textDecoration: "none",
  },
});

export default function SignInPage(): JSX.Element {
  const classes = useStyles();

  const { signIn } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  const onFormSubmit = async ({ email, password }: FormData): Promise<void> => {
    setLoading(true);
    const signedIn = await signIn(email, password);
    setLoading(false);
    if (signedIn.success) {
      history.push("/");
    } else if (signedIn.error) {
      setError(signedIn.error);
    } else {
      setError("User not found");
    }
  };

  return (
    <IdentityLayout loading={loading}>
      <>
        <Box pb={2}>
          <Typography variant="h6">Sign in</Typography>
        </Box>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <FormTextFieldWrapper>
            <TextField
              label="Email"
              placeholder="Type account's email address"
              fullWidth
              autoFocus
              variant="outlined"
              error={!!formState.errors.email}
              helperText={formState.errors.email?.message}
              InputProps={{
                type: "email",
                ...register("email"),
              }}
            />
          </FormTextFieldWrapper>
          <Box pb={2}>
            <TextField
              placeholder="Type your password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!formState.errors.password}
              helperText={formState.errors.password?.message}
              InputProps={{
                type: "password",
                autoComplete: "on",
                ...register("password"),
              }}
            />
          </Box>
          <Box pb={2}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
            >
              Submit
            </Button>
          </Box>
          <Box pb={2}>
            <Typography variant="caption" display="block" align="center">
              or
            </Typography>
          </Box>
          <Box>
            <Link to={SIGN_UP} className={classes.link}>
              <Button color="primary" variant="outlined" fullWidth size="large">
                Create new account
              </Button>
            </Link>
          </Box>
        </form>
      </>
    </IdentityLayout>
  );
}
