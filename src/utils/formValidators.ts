import * as yup from "yup";

export const emailValidator = yup
  .string()
  .email("Please eneter correct email address")
  .required("This field is required");

export const requiredStringValidator = yup.string().required("This field is required");

export const requiredNumberValidator = yup.number().required("Number is required");

export const repeatPasswordValidator = yup
  .string()
  .required("This field is required")
  .oneOf([yup.ref("password")], "Passwords must be identical");

export const passwordValidator = yup
  .string()
  .required("Password is required")
  .test("length", `${"Max length of string equals"}: 80`, (val) =>
    val ? val.length <= 80 : false
  )
  .test("length", `${"Min length of string equals"}: 6`, (val) =>
    val ? val.length >= 6 : false
  )
  .matches(/[a-z]/, "Password should contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password should contain at least one uppercase letter");
