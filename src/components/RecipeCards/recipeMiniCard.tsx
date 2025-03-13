import {
  Box,
  Card,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Image from '../image/Image';
import { paths } from '../../routes/paths';
import IRecipe from '../../interfaces/IRecipe';
import {
  favoritedColor, primary, unfavoritedColor,
} from '../../Constants';
import useRouter from '../../hooks/use-router';
import { useModal } from '../../providers/ModalProvider';
import { updateUserFavorites } from '../../services/DbService';
import { useAuth } from '../../contexts/AuthContext';

interface RecipeMiniCardProps {
  recipe: IRecipe,
  setShowSearch: Dispatch<SetStateAction<boolean>>;
}

export default function RecipeMiniCard(props: RecipeMiniCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { recipe, setShowSearch } = props;

  const { currentUser, setCurrentUser } = useAuth();
  const { setShowLoginModal, setTriggerFavMessage } = useModal();

  const linkTo = paths.recipe.recipe(recipe.id);
  const router = useRouter();

  const handleClick = () => {
    setShowSearch(false);
    router.push(linkTo);
  };

  const handleFavoriteClick = async () => {
    if (currentUser) {
      await updateUserFavorites(currentUser, recipe.id);

      const updatedFavorites = currentUser.favorites.includes(recipe.id)
        ? currentUser.favorites.filter((id) => id !== recipe.id)
        : [...currentUser.favorites, recipe.id];

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

  useEffect(() => {
    if (currentUser) {
      setIsFavorited(currentUser.favorites.includes(recipe.id));
    }
  }, [currentUser, recipe.id, currentUser?.favorites]);

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&:hover': {
          '.image': {
            transform: 'scale(1.05)',
          },
          '.title': {
            color: primary,
          },
          '.card': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Slightly deeper shadow on hover
          },
        },
      }}
    >
      {/* Card Container */}
      <Card
        className="card"
        sx={{
          height: 165,
          width: 165,
          borderRadius: '12px',
          position: 'relative',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
          border: '1px solid rgba(0, 0, 0, 0.15)',
          transition: 'box-shadow 0.4s ease-in-out, transform 0.4s ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
          },
        }}
      >
        {/* Favorite Button */}
        <Box sx={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
        }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFavoriteClick();
            }}
            sx={{
              color: isFavorited ? favoritedColor : unfavoritedColor,
              backgroundColor: 'rgba(255,255,255,0.85)', // Keeps visibility strong
              borderRadius: '50%',
              padding: '3px', // Slightly smaller padding
              transform: 'scale(0.85)', // Shrinks the size just enough
              top: 6, // Adjusts positioning to sit slightly lower
              right: 6,
              transition: 'background 0.3s ease-in-out, transform 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
                transform: 'scale(0.95)', // Subtle hover effect
              },
            }}
          >
            {isFavorited ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Image */}
        <Box className="image">
          <Image
            alt={recipe.title}
            src={recipe.image}
            ratio="1/1"
            sx={{
              borderRadius: '12px',
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ensures the image scales properly
              transition: 'transform 0.4s ease-in-out',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Card>

      {/* Title Outside the Card for Better Visibility */}
      <Typography
        className="title"
        sx={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'black',
          textAlign: 'center',
          maxWidth: '95%', // Keep it proportional
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis', // Prevents awkward wrapping
          cursor: 'pointer',
        }}
      >
        {recipe.title}
      </Typography>
    </Box>

  );
}
