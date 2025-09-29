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
import IRecipe from '../../../interfaces/IRecipe';

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

  // Sort by date for new recipes
  const newRecipes = recipesData?.sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  ).slice(0, numOfRecipesToShow);

  // Calculate trending score with time decay
  const calculateTrendingScore = (recipe: IRecipe) => {
    const daysSinceCreation = (new Date().getTime() - new Date(recipe.dateCreated).getTime()) / (1000 * 3600 * 24);
    const timeDecay = Math.exp(-daysSinceCreation / 30); // 30 days half-life
    return (recipe.favorites * 0.4 + (recipe.averageRating || 0) * 0.6) * timeDecay;
  };

  const trendingRecipes = recipesData?.sort(
    (a, b) => calculateTrendingScore(b) - calculateTrendingScore(a),
  ).slice(0, numOfRecipesToShow);

  // More flexible recommended recipe filtering
  const recommendedRecipes = recipesData
    ?.filter(recipe => (
      // Include highly rated OR frequently favorited recipes
      recipe.averageRating >= 3.5 || recipe.favorites >= 1
    ))
    .sort((a, b) => (
      // Sort by a combination of rating and favorites
      (b.averageRating * 2 + b.favorites) - (a.averageRating * 2 + a.favorites)
    ))
    .slice(0, numOfRecipesToShow);

  const getTabTitle = () => {
    switch (tabIndex) {
    case 0: return 'Trending';
    case 1: return 'New';
    case 2: return 'Recommended';
    default: return 'Recipes';
    }
  };

  const recipesToDisplay = () => {
    const recipes = {
      0: trendingRecipes,
      1: newRecipes,
      2: recommendedRecipes,
    }[tabIndex] || newRecipes;

    if (!recipes?.length) {
      return (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No {getTabTitle().toLowerCase()} recipes available yet
            </Typography>
          </Box>
        </Grid>
      );
    }

    return recipes.map((recipe) => (
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
    ));
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
          {recipesToDisplay()}
        </Grid>
      </Container>
    </Box>
  );
}
