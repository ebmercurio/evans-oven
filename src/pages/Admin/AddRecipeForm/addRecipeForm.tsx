import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Alert, Box, Grid } from '@mui/material';
import FormProvider, { RHFTextField } from '../../../components/hook-form/index';
import AddRecipeIngredients from './addRecipeIngredients';
import AddRecipeTags from './addRecipeTags';
import IRecipeIngredient from '../../../interfaces/IRecipeIngredient';
import IRecipe from '../../../interfaces/IRecipe';
import { addRecipe } from '../../../services/DbService';
import AddRecipeInstructions from './addRecipeInstructions';
import IInstructions from '../../../interfaces/IInstructions';

interface AddRecipeFormProps {
  openBool: boolean,
  onClose: () => void,
}

export default function AddRecipeForm(
  { onClose, openBool, ...other }: AddRecipeFormProps,
) {
  const [ingredients, setIngredients] = useState<IRecipeIngredient[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const newDate = new Date();

  const defaultValues = {
    id: '',
    dateCreated: newDate.toDateString(),
    image: '',
    ingredients: [] as IRecipeIngredient[],
    instructions: [] as IInstructions[],
    servings: '',
    tags: [],
    title: '',
    comments: [],
    totalStars: null,
    commentsWithRatings: null,

  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const recipeToAdd: IRecipe = {
        averageRating: 0,
        comments: data.comments,
        dateCreated: data.dateCreated,
        favorites: 0,
        id: data.id,
        image: data.image,
        ingredients,
        instructions: data.instructions,
        servings: data.servings,
        tags,
        title: data.title,
      };
      addRecipe(recipeToAdd);
      reset();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const handleIngredientData = (recipeIngredients: IRecipeIngredient[]) => {
    setIngredients(recipeIngredients);
  };

  const handleTagsData = (recipeTags: string[]) => {
    setTags(recipeTags.sort());
  };

  return (
    <Dialog open={openBool} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Recipe:</DialogTitle>

        <DialogContent>
          <Grid container>

            <Grid item xs={12}>
              <RHFTextField
                name="title"
                label="Title *"
                sx={{ mt: 3, width: '500px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="image"
                label="Image Url *"
                sx={{
                  mt: 3,
                  width: '500px',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="serving"
                label="Servings *"
                sx={{ mt: 3, width: '500px' }}
              />
            </Grid>

            <AddRecipeIngredients
              finalIngredientsList={handleIngredientData}
              isSubmitting={isSubmitting}
            />

            <Grid item xs={12}>
              <AddRecipeInstructions />
            </Grid>
            <Grid item xs={12}>
              <AddRecipeTags
                finalTagsList={handleTagsData}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create Recipe
          </LoadingButton>
          {errorMessage && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">
                {errorMessage}
              </Alert>
            </Box>
          )}
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
