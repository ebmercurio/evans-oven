import {
  Card, CardMedia, CardContent, Typography, IconButton,
  Box, Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IRecipe from '../../interfaces/IRecipe';
import { updateUserFavorites } from '../../services/DbService';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../providers/ModalProvider';
import {
  cardBackground,
  favoritedColor, primary, unfavoritedColor,
  white,
} from '../../Constants';
import { auth } from '../../firebase';
import useRouter from '../../hooks/use-router';

interface RecipeCardProps {
  recipe: IRecipe;
}

export default function RecipeCard(props: RecipeCardProps) {
  const { recipe } = props;
  // const [recipeTags, setRecipeTags] = useState<ITag[]>([]);
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuth();
  const { setShowLoginModal, setTriggerFavMessage } = useModal();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [triggerEmailVerifyMessage, setTriggerEmailVerifyMessage] = useState(false);

  const handleFavoriteClick = async () => {
    if (currentUser && auth.currentUser?.emailVerified) {
      await updateUserFavorites(currentUser, recipe.id);

      // Update the currentUser context with the new favorite list
      const updatedFavorites = currentUser.favorites.includes(recipe.id)
        ? currentUser.favorites.filter((id) => id !== recipe.id)
        : [...currentUser.favorites, recipe.id];

      setCurrentUser({
        ...currentUser,
        favorites: updatedFavorites,
      });

      setIsFavorited((prev) => !prev);
    } else if (currentUser && auth.currentUser?.emailVerified === false) {
      setTriggerEmailVerifyMessage(true);
    } else {
      setTriggerFavMessage(true);
      setShowLoginModal(true);
    }
  };

  const handleCardClick = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  useEffect(() => {
    // const fetchTags = async () => {
    //   const tagsPromises = recipe.tags.map((tag) => getTagById(tag));
    //   const tags = await Promise.all(tagsPromises);
    //   setRecipeTags(tags);
    // };

    // fetchTags();

    if (currentUser && auth.currentUser?.emailVerified) {
      setIsFavorited(currentUser.favorites.includes(recipe.id));
    }
  }, []);

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        maxWidth: { xs: '100%', sm: 360 },
        borderRadius: { xs: '8px', sm: '16px' },
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.05)' },
        height: '100%',
        display: 'flex',
        backgroundColor: cardBackground,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.title}
        sx={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontSize: '18px',
              fontFamily: 'Montserrat',
              fontWeight: 500,
              marginBottom: '8px',
            }}
          >
            {recipe.title}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFavoriteClick();
            }}
            sx={{ color: isFavorited ? favoritedColor : unfavoritedColor }}
          >
            {isFavorited ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 0.5,
            mb: 1,
          }}
        >
          {recipe.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              sx={{
                backgroundColor: primary,
                color: white,
                fontWeight: 'bold',
                maxWidth: '100%', // Ensure tags don't overflow
              }}
            />
          ))}
        </Box>
      </CardContent>
      {triggerEmailVerifyMessage && (
        <Snackbar
          open={triggerEmailVerifyMessage}
          autoHideDuration={3000}
          onClose={() => setTriggerEmailVerifyMessage(false)}
          action={(
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setTriggerEmailVerifyMessage(false)}
            >
              <CloseIcon />
            </IconButton>
          )}
        >
          <Alert onClose={() => setTriggerEmailVerifyMessage(false)} severity="error">
            You must verify your email before favoriting/commenting
          </Alert>
        </Snackbar>
      )}
    </Card>

  );
}
