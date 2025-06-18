import { useState } from 'react';
import {
  Box, Container, Grid, Tabs, Tab,
  styled,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import RecipeCard from '../../../components/RecipeCards/recipeCard';
import { getAllRecipes } from '../../../services/DbService';
import { blackText, secondary, whiteBackground } from '../../../Constants';

const StyledTabs = styled(Tabs)({
  borderBottom: `2px solid ${secondary}`,
  '& .MuiTab-root': {
    minWidth: 'auto',
    marginRight: '16px',
    color: blackText,
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'uppercase',
  },
  '& .MuiTab-root.Mui-selected': {
    color: secondary,
  },
  '& .MuiTabs-indicator': {
    backgroundColor: secondary,
  },
});

export default function HomeBody() {
  const [tabIndex, setTabIndex] = useState(0);
  const { data: recipesData, error: recipesError } = useQuery(
    ['recipes'],
    async () => {
      const res = await getAllRecipes();
      return res;
    },
  );

  if (recipesError) {
    return (
      <Box>
        <Typography>
          Error loading recipes
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  // TODO: Create trending, new, and recommended recipes in DB instead of getting all recipes
  const numOfRecipesToShow = 6;

  const newRecipes = recipesData?.sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  ).slice(0, numOfRecipesToShow);

  const trendingRecipes = recipesData?.sort(
    (a, b) => (b.favorites + b.averageRating) - (a.favorites + a.averageRating),
  ).slice(0, numOfRecipesToShow);

  const recommendedRecipes = recipesData?.filter(
    (recipe) => recipe.averageRating >= 4 && recipe.favorites >= 10,
  ).slice(0, numOfRecipesToShow);

  const recipesToDisplay = () => {
    switch (tabIndex) {
      case 0: return trendingRecipes;
      case 1: return newRecipes;
      case 2: return recommendedRecipes;
      default: return newRecipes;
    }
  };

  return (
    <Box sx={{ py: 2, backgroundColor: whiteBackground }}>
      <Container>
        <StyledTabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Trending" />
          <Tab label="New Recipes" />
          <Tab label="Recommended" />
        </StyledTabs>
        <Grid
          container
          spacing={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 1,
          }}
        >
          {recipesToDisplay()?.map((recipe) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={recipe.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 1,
              }}
            >
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
