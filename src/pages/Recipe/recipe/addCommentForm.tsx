/* eslint-disable no-param-reassign */
import { useCallback, useState } from 'react';
import { trackRecipeEvent } from '../../../services/analytics';
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
    resolver: (async (data) => {
      const errors: Record<string, { type: string; message: string }> = {};

      if (data.rating === null) {
        errors.rating = {
          type: 'required',
          message: 'Please rate this recipe before submitting',
        };
      }

      if (data.comment && data.comment.length > 1000) {
        errors.comment = {
          type: 'maxLength',
          message: 'Review must be 1000 characters or less',
        };
      }

      return {
        values: data,
        errors,
      };
    }),
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const commentValue = watch('comment', '');
  // const ratingValue = watch('rating', null);

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

        // Track successful comment submission
        trackRecipeEvent('add_comment', currentRecipe.id, currentRecipe.title);

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
    <Dialog
      open={openBool}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      {...other}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 0 }}> Share Your Experience </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1.5,
                    color: blackText,
                    fontWeight: 500,
                  }}
                >
                  Rate this recipe
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        size="large"
                        value={Number(field.value)}
                        onChange={(event, newValue) => {
                          field.onChange(newValue);
                          if (newValue) {
                            trackRecipeEvent('rate_recipe', currentRecipe.id, `${newValue} stars`);
                          }
                        }}
                        sx={{
                          fontSize: '2rem',
                          '& .MuiRating-iconEmpty': {
                            color: warmGold,
                          },
                          '& .MuiRating-iconFilled': {
                            color: warmGold,
                          },
                        }}
                      />
                    )}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                  >
                    {Number(methods.getValues('rating')) > 0
                      ? `${Number(methods.getValues('rating'))} stars`
                      : 'Click to rate'}
                  </Typography>
                </Stack>
                {!!errors.rating && (
                  <FormHelperText error sx={{ px: 1 }}>
                    {errors.rating?.message}
                  </FormHelperText>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1.5,
                    color: blackText,
                    fontWeight: 500,
                  }}
                >
                  Write a review (optional)
                </Typography>
                <RHFTextField
                  name="comment"
                  multiline
                  rows={4}
                  placeholder="Share what you loved about this recipe or any tips for others..."
                  sx={{
                    width: '100%',
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
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mr: 1 }}
            >
              {commentValue.length}/1000
            </Typography>
          </Box>
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
