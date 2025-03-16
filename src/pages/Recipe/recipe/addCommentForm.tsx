/* eslint-disable no-param-reassign */
import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider, { RHFTextField } from '../../../components/hook-form/index';
import IComment from '../../../interfaces/IComment';
import { addComment } from '../../../services/DbService';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import { useAuth } from '../../../contexts/AuthContext';
import {
  blackText, cancelColor, primary, warmGold,
} from '../../../Constants';

interface AddCommentFormProps {
  openBool: boolean,
  onClose: () => void,
}

export default function addCommentForm({
  onClose, openBool, ...other
}: AddCommentFormProps) {
  const newDate = new Date();
  const { currentRecipe, setCurrentRecipe } = useRecipeContext();
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const defaultValues = {
    id: '',
    postedAt: newDate.toDateString(),
    rating: null,
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (currentUser?.displayName) {
      try {
        const commentToUpdate: IComment = {
          postedAt: data.postedAt,
          content: data.comment,
          rating: data.rating,
          username: currentUser.displayName,
        };

        const commentId = await addComment(commentToUpdate, currentRecipe);

        const updatedRecipe = {
          ...currentRecipe,
          comments: [
            ...currentRecipe.comments, commentId,
          ],
        };

        setCurrentRecipe(updatedRecipe);

        reset();
        onClose();
      } catch (error: unknown) {
        setErrorMessage('Error adding comment');
      }
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog open={openBool} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Add Comment </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
            <Typography color={blackText} variant="body2">Your comment about this product:</Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  {...field}
                  size="small"
                  value={Number(field.value)}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                  }}
                  sx={{
                    mr: 1,
                    '& .MuiRating-iconEmpty': {
                      color: warmGold, // Change the border color of empty stars
                    },
                  }}
                />
              )}
            />
          </Stack>

          {!!errors.rating && (
          <FormHelperText error>
            {' '}
            {errors.rating?.message}
          </FormHelperText>
          )}

          <Grid item xs={12}>
            <RHFTextField
              name="comment"
              label="Comment *"
              multiline
              rows={3}
              sx={{
                mt: 3,
                width: '500px',
                fontFamily: 'Montserrat',
                fontWeight: 600,
                color: blackText,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Focus state (removes default blue)
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: blackText, // Default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: primary, // Changes floating label color on focus
                },
              }}
              inputProps={{ style: { color: primary } }}
            />
          </Grid>

        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={onCancel}
            sx={{
              mr: 1,
              mb: 1,
              color: cancelColor, // Text color
              borderColor: cancelColor, // Outline color
              '&:hover': {
                backgroundColor: 'rgba(200, 116, 80, 0.2)',
                borderColor: cancelColor, // Fills button with your cancel color on hover
                color: cancelColor, // Ensures text stays readable
                opacity: 0.8, // Creates a soft "see-through" effect
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              mx: 1,
              mb: 1,
              backgroundColor: primary,
              '&:hover': {
                backgroundColor: primary, // Fills button with your primary color on hover
                opacity: 0.8, // Creates a soft "see-through" effect
              },
            }}
          >
            Post
          </LoadingButton>
        </DialogActions>
        {errorMessage && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">
              {errorMessage}
            </Alert>
          </Box>
        )}
      </FormProvider>
    </Dialog>
  );
}
