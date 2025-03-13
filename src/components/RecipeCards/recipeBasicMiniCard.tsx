import {
  Box,
  Card,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from '../image/Image';
import { paths } from '../../routes/paths';
import IRecipe from '../../interfaces/IRecipe';
import { primary, straightFont } from '../../Constants';
import useRouter from '../../hooks/use-router';

interface RecipeBasicMiniCardProps {
  recipe: IRecipe,
}

export default function RecipeBasicMiniCard(props: RecipeBasicMiniCardProps) {
  const { recipe } = props;
  const linkTo = paths.recipe.recipe(recipe.id);
  const router = useRouter();

  const handleClick = () => {
    router.push(linkTo);
  };

  return (

    <Box
      onClick={handleClick}
      sx={{
        alignItems: 'center',
        '&:hover': {
          '.image': {
            transform: 'scale(1.05)',
          },
          '.title': {
            color: primary,
          },
        },
      }}
    >
      <Card
        sx={{
          height: 115,
          width: 115,
          position: 'relative',
        }}
      >
        <Box className="image">
          <Image
            alt={recipe.title}
            src={recipe.image}
            ratio="1/1"
            sx={{
              borderRadius: 1.5,
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out',
              className: 'image',
            }}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: '-5%',
            left: '50%',
            width: '55%',
            height: '17%',
            textAlign: 'center',
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 3,
          }}
        >
          <FavoriteBorderIcon sx={{ color: primary, marginLeft: 0.5, marginRight: 1.5 }} />
          <Typography sx={{ color: primary, fontFamily: straightFont }}>
            {recipe.favorites}
          </Typography>
        </Box>
      </Card>
      <Typography
        className="title"
        sx={{
          maxWidth: 115,
          height: 40,
          fontFamily: straightFont,
          color: 'black',
          textDecoration: 'none',
          fontSize: 14,
          cursor: 'pointer',
          transition: 'color 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          wordWrap: 'break-word',
        }}
      >
        {recipe.title}
      </Typography>
    </Box>
  );
}
