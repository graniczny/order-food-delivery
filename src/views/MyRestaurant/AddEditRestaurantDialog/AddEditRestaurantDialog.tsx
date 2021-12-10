import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DialogActions, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomDialog from "../../../components/Dialog/CustomDialog/CustomDialog";
import CustomDialogContent from "../../../components/Dialog/CustomDialogContent/CustomDialogContent";
import FormTextFieldWrapper from "../../../components/FormTextFieldWrapper/FormTextFieldWrapper";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { UserContext } from "../../../context/UserContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { requiredStringValidator } from "../../../utils/formValidators";
import { EditRestaurantData } from "./EditRestaurantData";

interface Props {
  onClose: () => void;
  restaurantData?: EditRestaurantData;
}

interface FormData {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: requiredStringValidator,
  description: requiredStringValidator,
});

const createRestaurantError =
  "Error occured while creating restaurant, please try again.";
const editRestaurantError =
  "Error occured while editing restaurant data, please try again.";

export default function AddEditRestaurantDialog({
  onClose,
  restaurantData,
}: Props): JSX.Element {
  const { userId } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const { control, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: restaurantData?.name || "",
      description: restaurantData?.description || "",
    },
  });

  const formSubmit = async ({ name, description }: FormData): Promise<void> => {
    if (restaurantData) {
      const restaurantRef = fireBaseDatabase.ref(`restaurants/${restaurantData.id}`);
      try {
        await restaurantRef.update({
          name,
          description,
        });
        onClose();
      } catch (err) {
        setError(editRestaurantError);
      }
    } else if (userId) {
      const newRestaurantItem = fireBaseDatabase.ref("restaurants").push();
      try {
        await newRestaurantItem.set({
          name,
          description,
          owner: userId,
          meals: [],
        });
        onClose();
      } catch (err) {
        setError(createRestaurantError);
      }
    }
  };

  return (
    <CustomDialog open onClose={onClose} maxWidth="sm" fullWidth>
      <CustomDialogContent heading="Add new restaurant">
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormTextFieldWrapper>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  label="Name"
                  fullWidth
                  autoFocus
                  variant="outlined"
                  error={!!formState.errors.name}
                  helperText={formState.errors.name?.message}
                />
              )}
            />
          </FormTextFieldWrapper>
          <FormTextFieldWrapper>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  multiline
                  label="Describe restaurants food type"
                  fullWidth
                  variant="outlined"
                  error={!!formState.errors.description}
                  helperText={formState.errors.description?.message}
                />
              )}
            />
          </FormTextFieldWrapper>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
}
