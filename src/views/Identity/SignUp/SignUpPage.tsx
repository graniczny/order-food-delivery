import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { ArrowLeft } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import FormTextFieldWrapper from "../../../components/FormTextFieldWrapper/FormTextFieldWrapper";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { auth, fireBaseDatabase } from "../../../firebase";
import { Roles } from "../../../interfaces/Roles";
import { SIGN_IN } from "../../../routing/paths";
import {
  emailValidator,
  passwordValidator,
  repeatPasswordValidator,
} from "../../../utils/formValidators";
import IdentityLayout from "../common/IdentityLayout";

interface FormData {
  email: string;
  password: string;
  repeatPassword: string;
  accountType: Roles;
}

const schema = yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  repeatPassword: repeatPasswordValidator,
});

export default function SignUpPage(): JSX.Element {
  const { setError } = useContext(ErrorContext);

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      accountType: Roles.RESTAURANT,
    },
  });
  const history = useHistory();

  const onFormSubmit = async ({
    email,
    password,
    accountType,
  }: FormData): Promise<void> => {
    setLoading(true);
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      if (res?.user?.uid) {
        await fireBaseDatabase.ref(`users/${res.user.uid}`).set({
          role: accountType,
          email,
        });
        setLoading(false);
        history.push("/");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <IdentityLayout loading={loading}>
      <>
        <FormTextFieldWrapper>
          <Typography variant="h6">Sign up</Typography>
        </FormTextFieldWrapper>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <FormTextFieldWrapper>
            <TextField
              label="Email"
              placeholder="Type your email"
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
          <FormTextFieldWrapper>
            <TextField
              label="Password"
              placeholder="Type new password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!formState.errors.password}
              helperText={formState.errors.password?.message}
              InputProps={{
                type: "password",
                ...register("password"),
              }}
            />
          </FormTextFieldWrapper>
          <Box pb={3}>
            <TextField
              label="Repeat password"
              placeholder="Repeat password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!formState.errors.repeatPassword}
              helperText={formState.errors.repeatPassword?.message}
              InputProps={{
                type: "password",
                ...register("repeatPassword"),
              }}
            />
          </Box>
          <FormTextFieldWrapper>
            <Controller
              name="accountType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Choose your account type</FormLabel>
                  <RadioGroup value={value} onChange={onChange}>
                    <Box display="flex">
                      <FormControlLabel
                        value={Roles.CLIENT}
                        control={<Radio color="primary" />}
                        label="Client"
                      />
                      <FormControlLabel
                        value={Roles.RESTAURANT}
                        control={<Radio color="primary" />}
                        label="Restaurant"
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>
              )}
            />
          </FormTextFieldWrapper>
          <Box mb={3}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </Box>
          <Box>
            <Link to={SIGN_IN} style={{ display: "block" }}>
              <Box display="flex" alignItems="center">
                <ArrowLeft fontSize="default" color="primary" />
                <Typography variant="caption" color="primary">
                  Sign in page
                </Typography>
              </Box>
            </Link>
          </Box>
        </form>
      </>
    </IdentityLayout>
  );
}
