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
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FormProvider, { RHFTextField } from '../../../components/hook-form/index';
import IComment from '../../../interfaces/IComment';
import { addComment } from '../../../services/DbService';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import { useAuth } from '../../../contexts/AuthContext';
import {
  blackText, cancelColor, primary, warmGold,
} from '../../../Constants';

interface AddCommentFormProps {
  openBool: boolean;
  onClose: () => void;
}

export default function AddCommentForm({
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
      const errors: Record<string, { type: string; message: string }> = {};      if (data.rating === null) {
        errors.rating = {
          type: 'required',
          message: 'Please rate this recipe before submitting'
        };
      }

      if (data.comment && data.comment.length > 1000) {
        errors.comment = {
          type: 'maxLength',
          message: 'Review must be 1000 characters or less'
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
  const ratingValue = watch('rating', null);

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
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                                    Rate this recipe
                  <Box
                    component="span"
                    sx={{
                      color: warmGold,
                      ml: 0.5,
                      fontSize: '0.75rem',
                      bgcolor: 'rgba(227, 183, 120, 0.1)',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                                        required
                  </Box>
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
                        }}
                        sx={{
                          fontSize: '2rem',
                          '& .MuiRating-iconEmpty': {
                            color: warmGold,
                          },
                          '& .MuiRating-iconFilled': {
                            color: warmGold,
                          },
                          '&:hover': {
                            '& .MuiRating-iconHover': {
                              color: '#D9A253',
                            },
                          },
                        }}
                      />
                    )}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: ratingValue ? blackText : 'text.secondary',
                      fontWeight: ratingValue ? 600 : 400,
                    }}
                  >
                    {ratingValue
                      ? `${ratingValue} star${ratingValue === 1 ? '' : 's'}`
                      : 'Click to rate'}
                  </Typography>
                </Stack>
                {!!errors.rating && (
                  <FormHelperText error sx={{ px: 1, mt: 1 }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box component="span">
                                        Write a review
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                      }}
                    >
                                            (optional)
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: commentValue.length > 900
                        ? commentValue.length > 1000
                          ? 'error.main'
                          : 'warning.main'
                        : 'text.secondary',
                    }}
                  >
                    {commentValue.length}/1000
                  </Typography>
                </Typography>

                <Stack spacing={2}>
                  <RHFTextField
                    name="comment"
                    multiline
                    rows={4}
                    placeholder="Share what you loved about this recipe or any tips for others..."
                    sx={{
                      width: '100%',
                      fontFamily: 'Montserrat',
                      color: blackText,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: primary,
                        },
                        '&:hover fieldset': {
                          borderColor: primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primary,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: blackText,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: primary,
                      },
                    }}
                    inputProps={{
                      style: { color: primary },
                      maxLength: 1000,
                    }}
                  />

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(227, 183, 120, 0.1)',
                      borderRadius: 1,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <LightbulbIcon sx={{ color: warmGold }} />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                                            Share your experience cooking this recipe! Did you make any substitutions? How did it turn out?
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
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
              color: cancelColor,
              borderColor: cancelColor,
              '&:hover': {
                backgroundColor: 'rgba(200, 116, 80, 0.2)',
                borderColor: cancelColor,
                color: cancelColor,
                opacity: 0.8,
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
                backgroundColor: primary,
                opacity: 0.8,
              },
            }}
          >
                        Post
          </LoadingButton>
        </DialogActions>

        {errorMessage && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Alert severity="error">
              {errorMessage}
            </Alert>
          </Box>
        )}
      </FormProvider>
    </Dialog>
  );
}