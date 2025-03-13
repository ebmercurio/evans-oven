import { useState } from 'react';
import {
  Box, Grid,
  Pagination,
  paginationClasses,
} from '@mui/material';
import IRecipe from '../../../interfaces/IRecipe';
import RecipeCard from '../../../components/RecipeCards/recipeCard';

interface RecipeListProps {
  recipes: IRecipe[],
}

export default function RecipeList(props: RecipeListProps) {
  const { recipes } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const recipesPerPage = 8;
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <Box>
      <Grid container spacing={1} sx={{ marginLeft: 0.5 }}>
        {recipes.slice(startIndex, endIndex).map((recipe: IRecipe) => (
          <Grid item key={recipe.id} xs={12} sm={3} sx={{ zIndex: 1, '&:hover': { zIndex: 2 } }}>
            <RecipeCard key={recipe.id} recipe={recipe} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              mx: 'auto',
              [`& .${paginationClasses.ul}`]: {
                my: 5,
                mx: 'auto',
                justifyContent: 'center',
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
