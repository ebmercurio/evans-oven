import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Box, Container, Grid, Tabs, Tab, styled,
  Typography,
} from '@mui/material';
import { getAllRecipes, getAllTags } from '../../../services/DbService';
import RecipeCard from '../../../components/RecipeCards/recipeCard';
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

export default function HomeBottom() {
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const { 
    data: tagsData, 
    error: tagsError,
    isLoading: isTagsLoading 
  } = useQuery(['tags'], getAllTags);

  const { 
    data: recipesData, 
    error: recipesError,
    isLoading: isRecipesLoading 
  } = useQuery(['recipes'], getAllRecipes);

  // Return early if no data available yet
  if (!tagsData || !recipesData) {
    if (isTagsLoading || isRecipesLoading) {
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Loading recipes and tags...</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  if (tagsError) {
    console.error('Tags Error:', tagsError); // Debug log
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading tags
        </Typography>
      </Box>
    );
  }

  if (recipesError) {
    console.error('Recipes Error:', recipesError); // Debug log
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading recipes
        </Typography>
      </Box>
    );
  }

  // Get tags with their recipe counts
  const tagCounts = tagsData.map(tag => ({
    ...tag,
    recipeCount: recipesData.filter(recipe => recipe.tags.includes(tag.name)).length
  }));

  // Get seasonal tags (example seasonal mapping)
  const currentMonth = new Date().getMonth();
  const seasonalTags = {
    0: ['winter', 'soup', 'comfort food'], // January
    1: ['valentine', 'chocolate', 'romantic'], // February
    2: ['spring', 'fresh', 'light'], // March
    3: ['easter', 'spring', 'brunch'], // April
    4: ['spring', 'mothers day', 'picnic'], // May
    5: ['summer', 'bbq', 'grill'], // June
    6: ['summer', 'ice cream', 'no bake'], // July
    7: ['summer', 'fresh', 'quick'], // August
    8: ['fall', 'back to school', 'lunch'], // September
    9: ['fall', 'halloween', 'pumpkin'], // October
    10: ['thanksgiving', 'fall', 'comfort food'], // November
    11: ['christmas', 'holiday', 'winter'], // December
  }[currentMonth] || [];

  // Filter tags with recipes and sort by priority
  const availableTags = tagCounts
    .filter(tag => tag.recipeCount > 0)
    .sort((a, b) => {
      // Give priority to seasonal tags
      const aIsSeasonal = seasonalTags.some(seasonal => 
        a.name.toLowerCase().includes(seasonal.toLowerCase()));
      const bIsSeasonal = seasonalTags.some(seasonal => 
        b.name.toLowerCase().includes(seasonal.toLowerCase()));
      
      if (aIsSeasonal && !bIsSeasonal) return -1;
      if (!aIsSeasonal && bIsSeasonal) return 1;
      
      // Then sort by recipe count
      return b.recipeCount - a.recipeCount;
    });

  // Take top 5 tags
  const popularTags = availableTags.slice(0, 5);

  // If no tags with recipes, show message
  if (!popularTags.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>No tags available with recipes</Typography>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTagIndex(newValue);
  };

  // Get recipes for the selected tag
  const selectedTag = popularTags[selectedTagIndex];

  const filteredRecipes = recipesData
    .filter(recipe => recipe.tags.includes(selectedTag.name));
  
  // Randomly select up to 8 recipes to display
  const displayRecipes = [...filteredRecipes]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  // If no recipes for the selected tag, show empty message
  if (!displayRecipes.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>No recipes available for selected tag</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: whiteBackground,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 4,
    }}
    >
      <Container>
        <StyledTabs value={selectedTagIndex} onChange={handleTabChange}>
          {popularTags.map((tag) => (
            <Tab key={tag.id} label={tag.name} />
          ))}
        </StyledTabs>
        <Grid container spacing={3} sx={{ marginTop: '24px' }}>
          {displayRecipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
