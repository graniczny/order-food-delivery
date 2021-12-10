import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DialogActions, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomDialog from "../../../components/Dialog/CustomDialog/CustomDialog";
import CustomDialogContent from "../../../components/Dialog/CustomDialogContent/CustomDialogContent";
import FormTextFieldWrapper from "../../../components/FormTextFieldWrapper/FormTextFieldWrapper";
import { ErrorContext } from "../../../context/ErrorContextProvider";
import { fireBaseDatabase } from "../../../firebase";
import { Meal, MealWithId } from "../../../interfaces/Meal";
import {
  requiredNumberValidator,
  requiredStringValidator,
} from "../../../utils/formValidators";

interface Props {
  onClose: () => void;
  restaurantId: string;
  mealData?: MealWithId;
}

const schema = yup.object().shape({
  name: requiredStringValidator,
  description: requiredStringValidator,
  price: requiredNumberValidator,
});

const createMealError = "Error occured while creating new meal";
const updateMealError = "Error occured while updating meal data";

export default function AddEditMealDialog({
  onClose,
  restaurantId,
  mealData,
}: Props): JSX.Element {
  const { setError } = useContext(ErrorContext);

  const { handleSubmit, formState, control } = useForm<Meal>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: mealData?.name || "",
      description: mealData?.description || "",
      price: mealData?.price || undefined,
    },
  });

  const formSubmit = async ({ name, description, price }: Meal): Promise<void> => {
    if (mealData) {
      try {
        const newMealItem = fireBaseDatabase.ref(
          `restaurants/${restaurantId}/meals/${mealData.id}`
        );
        await newMealItem.update({
          name,
          description,
          price,
        });
        onClose();
      } catch (error) {
        setError(updateMealError);
      }
    } else {
      try {
        const newMealItem = fireBaseDatabase
          .ref(`restaurants/${restaurantId}/meals`)
          .push();
        newMealItem.set({
          name,
          description,
          price,
        });
        onClose();
      } catch (error) {
        setError(createMealError);
      }
    }
  };

  return (
    <CustomDialog open onClose={onClose} maxWidth="sm" fullWidth>
      <CustomDialogContent heading={mealData ? "Edit meal" : "Add new meal"}>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormTextFieldWrapper>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
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
                  value={value}
                  onChange={onChange}
                  multiline
                  label="Describe your meal"
                  fullWidth
                  variant="outlined"
                  error={!!formState.errors.description}
                  helperText={formState.errors.description?.message}
                />
              )}
            />
          </FormTextFieldWrapper>
          <FormTextFieldWrapper>
            <Controller
              name="price"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  label="Price"
                  fullWidth
                  variant="outlined"
                  error={!!formState.errors.price}
                  helperText={formState.errors.price?.message}
                  InputProps={{
                    type: "number",
                  }}
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
