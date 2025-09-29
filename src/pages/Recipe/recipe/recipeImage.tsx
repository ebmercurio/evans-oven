import {
  IconButton,
  Link as MuiLink,
  Grid,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import ShareIcon from '@mui/icons-material/Share';
import { useState, useEffect } from 'react';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import Image from '../../../components/image/Image';
import { favoritedColor, unfavoritedColor } from '../../../Constants';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../providers/ModalProvider';
import { updateUserFavorites } from '../../../services/DbService';

export default function RecipeImage() {
  const { currentRecipe } = useRecipeContext();
  const { currentUser, setCurrentUser } = useAuth();
  const { setShowLoginModal, setTriggerFavMessage } = useModal();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFavoriteClick = async () => {
    if (currentUser) {
      await updateUserFavorites(currentUser, currentRecipe.id);

      const updatedFavorites = currentUser.favorites.includes(currentRecipe.id)
        ? currentUser.favorites.filter((id) => id !== currentRecipe.id)
        : [...currentUser.favorites, currentRecipe.id];

      setCurrentUser({
        ...currentUser,
        favorites: updatedFavorites,
      });

      setIsFavorited((prev) => !prev);
    } else {
      setTriggerFavMessage(true);
      setShowLoginModal(true);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: currentRecipe.title,
          text: 'Check out this awesome recipe!',
          url: window.location.href,
        })
        .then(() => setSuccess('Recipe shared successfully!'))
        .then(() => setTimeout(() => setSuccess(''), 3000))
        .catch((error) => setErrorMessage(error.message));
    } else {
      setErrorMessage('Your browser does not support the share feature.');
    }
  };

  useEffect(() => {
    if (currentUser) {
      setIsFavorited(currentUser.favorites.includes(currentRecipe.id));
    }
  }, [currentUser, currentRecipe.id, currentUser?.favorites]);

  return (
    <Grid container>
      <Grid item xs={12} sx={{ my: 2 }}>
        <Image
          key={currentRecipe.id}
          alt={currentRecipe.title}
          src={currentRecipe.image}
          ratio="1/1"
          sx={{ cursor: 'zoom-in', borderRadius: '15px' }}
        />
      </Grid>
      <Grid container item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={6}>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFavoriteClick();
            }}
            sx={{ color: isFavorited ? favoritedColor : unfavoritedColor, fontSize: '1.75rem' }}
          >
            {isFavorited ? <Favorite fontSize="inherit" /> : <FavoriteBorder fontSize="inherit" />}
          </IconButton>

          <MuiLink
            component="button"
            variant="subtitle2"
            onClick={handleShareClick}
            sx={{
              color: unfavoritedColor,
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '1.5rem',
            }}
          >
            <ShareIcon fontSize="medium" sx={{ mr: 1, color: unfavoritedColor }} />
            <Typography sx={{ textDecoration: 'underline', color: unfavoritedColor }}>
              Share
            </Typography>
          </MuiLink>
          {success && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                {success}
              </Alert>
            </Box>
          )}
          {errorMessage && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">
                {errorMessage}
              </Alert>
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
