import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getAllRecipes, getAllTags, getMealTypeCategories,
  getPopularCategories,
} from '../../../services/DbService';
import IRecipe from '../../../interfaces/IRecipe';
import RecipeCard from '../../../components/RecipeCards/recipeCard';
import {
  cardBackground,
  primary, secondary, straightFont,
} from '../../../Constants';
import SearchBar from '../../../components/SearchBar';
import ICategoryCard from '../../../interfaces/ICategoryCard';
import useRouter from '../../../hooks/use-router';
import { paths } from '../../../routes/paths';
import MediumCategoryCard from '../../../components/CategoryCard/MediumCategoryCard';
import { useAuth } from '../../../contexts/AuthContext';
import ITag from '../../../interfaces/ITag';

export default function RecipesMain() {
  const [topRecipes, setTopRecipes] = useState<IRecipe[]>([]);
  const [popularCats, setPopularCats] = useState<ICategoryCard[]>([]);
  const [mealTypeCats, setMealTypeCats] = useState<ICategoryCard[]>([]);
  const router = useRouter();
  const { currentUser } = useAuth();

  const { data: allRecipesData, error: allRecipesError } = useQuery(
    ['allRecipes'],
    async () => {
      const res = await getAllRecipes();
      return res;
    },
  );

  const { data: allTagsData, error: allTagsError } = useQuery(
    ['allTags'],
    async () => {
      const res = await getAllTags();
      return res;
    },
  );

  const handleCategoryClick = (tagId: string) => {
    const linkTo = paths.recipe.tag(tagId);
    router.push(linkTo);
  };

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      const topRecipesData = allRecipesData?.slice(0, 6) ?? [];
      const mealTypeCategories = await getMealTypeCategories();
      const popularCategories = await getPopularCategories();

      setMealTypeCats(mealTypeCategories);
      setPopularCats(popularCategories);
      setTopRecipes(topRecipesData);
    };

    fetchFeaturedRecipes();
  }, [currentUser]);

  if (allRecipesError) {
    return (
      <Box>
        <Typography>
          Error loading recipes
        </Typography>
      </Box>
    );
  }

  if (allTagsError) {
    return (
      <Box>
        <Typography>
          Error loading tags
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <SearchBar />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" fontFamily="Caveat" sx={{ color: primary }}>What&apos;s Trending</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      {topRecipes.map((recipe: IRecipe) => (
        <Grid
          item
          key={recipe.id}
          xs={12}
          sm={3}
          sx={{
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <RecipeCard key={recipe.id} recipe={recipe} />
        </Grid>
      ))}
      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h4" fontFamily="Caveat" sx={{ color: primary }}>Popular Categories</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid container spacing={3}>
        {popularCats.map((categoryCard: ICategoryCard) => (
          <Grid item key={categoryCard.tag.id} xs={12} sm={6} md={3}>
            <MediumCategoryCard onClick={() => handleCategoryClick(categoryCard.tag.id)}>
              <img
                src={categoryCard.image}
                alt={categoryCard.tag.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  backgroundColor: secondary,
                  color: cardBackground,
                  textAlign: 'center',
                  py: 1,
                  borderRadius: '8px',
                }}
              >
                <Typography sx={{ color: 'white', fontFamily: straightFont, fontWeight: 'bold' }}>
                  {categoryCard.tag.name}
                </Typography>
              </Box>
            </MediumCategoryCard>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginTop: 5 }} />
      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h4" fontFamily="Caveat" sx={{ color: primary }}>Meal Types</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid
        item
        container
        spacing={2}
        sx={{
          marginTop: 5,
          justifyContent: 'center',
        }}
      >
        {mealTypeCats.map((categoryCard: ICategoryCard) => (
          <Grid item key={categoryCard.tag.id} xs={12} sm={6} md={3}>
            <MediumCategoryCard onClick={() => handleCategoryClick(categoryCard.tag.id)}>
              <img
                src={categoryCard.image}
                alt={categoryCard.tag.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  color: cardBackground,
                  backgroundColor: secondary,
                  textAlign: 'center',
                  py: 1,
                  borderRadius: '8px',
                }}
              >
                <Typography sx={{ color: 'white', fontFamily: straightFont, fontWeight: 'bold' }}>
                  {categoryCard.tag.name}
                </Typography>
              </Box>
            </MediumCategoryCard>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Typography variant="h4" fontFamily="Caveat" sx={{ color: primary }}>Other Categories</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid container justifyContent="center" spacing={3}>
        {allTagsData?.filter((tag: ITag) => !popularCats.map((cat) => cat.tag.id).includes(tag.id))
          .filter((tag: ITag) => !mealTypeCats.map((cat) => cat.tag.id).includes(tag.id))

          .sort((a, b) => a.name.localeCompare(b.name)) // Sorts the tags alphabetically by name
          .map((tag: ITag) => (
            <Grid item key={tag.id}>
              <Button
                onClick={() => handleCategoryClick(tag.id)}
              >
                <Chip
                  label={tag.name}
                  clickable
                  sx={{
                    fontFamily: straightFont,
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px 16px',
                    backgroundColor: '#8A9E76',
                    '&:hover': {
                      backgroundColor: '#8A9E76',
                    },
                    minWidth: '150px',
                  }}
                />
              </Button>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
