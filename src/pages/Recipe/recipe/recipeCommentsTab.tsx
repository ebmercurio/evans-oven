import {
  Grid,
  Stack,
  Rating,
  Button,
  Typography,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useState } from 'react';
import { fShortenNumber } from '../../../utils/format-number';
import RecipeCommentList from './recipeCommentList';
import AddCommentForm from './addCommentForm';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import { auth } from '../../../firebase';
import { useModal } from '../../../providers/ModalProvider';
import { blackText, warmGold } from '../../../Constants';

export default function RecipeComments() {
  const { currentRecipe } = useRecipeContext();
  const [openAddCommentForm, setOpenAddCommentForm] = useState<boolean>(false);
  const { setShowLoginModal, setTriggerCommentMessage } = useModal();

  const handleCloseCommentForm = () => {
    setOpenAddCommentForm(false);
  };

  const handleOpenCommentForm = () => {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      setOpenAddCommentForm(true);
    } else {
      setShowLoginModal(true);
      setTriggerCommentMessage(true);
    }
  };

  return (
    <>
      <Grid container sx={{ display: 'flex' }}>
        <Grid item xs={6}>
          <Stack spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="subtitle2">Average rating</Typography>

            <Typography fontSize="28px" fontWeight="bold">
              {fShortenNumber(currentRecipe.averageRating)}
              /5
            </Typography>

            <Rating
              readOnly
              value={currentRecipe.averageRating}
              precision={0.1}
              sx={{
                mr: 1,
                '& .MuiRating-iconEmpty': {
                  color: warmGold, // Change the border color of empty stars
                },
              }}
            />

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              (
              {fShortenNumber(currentRecipe.commentsWithRatings ?? 0)}
              {' '}
              ratings)
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <Button
            size="small"
            color="inherit"
            onClick={handleOpenCommentForm}
            startIcon={<CreateIcon />}
            sx={{ maxHeight: '50px' }}
          >
            <Typography fontSize="16px" fontWeight={600} color={blackText}>
              Leave a Comment
            </Typography>

          </Button>
        </Grid>
        <Grid item xs={12}>
          <RecipeCommentList />
        </Grid>
      </Grid>

      {openAddCommentForm && (
        <AddCommentForm
          openBool={openAddCommentForm}
          onClose={handleCloseCommentForm}
        />
      )}
    </>
  );
}
