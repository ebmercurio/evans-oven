import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import {
  Dialog, Box, InputBase, InputAdornment, useTheme, Divider, Grid, Typography, Button,
  dialogClasses,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import {
  darkGold,
  primary, searchText, straightFont, warmGold,
  whiteBackground,
} from '../../Constants';
import IRecipe from '../../interfaces/IRecipe';
import { getAllRecipes } from '../../services/DbService';
import RecipeMiniCard from '../RecipeCards/recipeMiniCard';
import IRecipeIngredient from '../../interfaces/IRecipeIngredient';

interface ISearchBoxProps {
  open: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function SearchBox(props: ISearchBoxProps) {
  const { open, setShow } = props;
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IRecipe[]>([]);
  const [resultsToShow, setResultsToShow] = useState<number>(8);
  const [latestResultsToShow, setLatestResultsToShow] = useState<number>(8);
  const [popularResultsToShow, setPopularResultsToShow] = useState<number>(8);
  const [allResultsToShow, setAllResultsToShow] = useState<number>(8);

  const { data: allRecipes, error } = useQuery(
    ['allRecipes'],
    async () => {
      const res = await getAllRecipes();
      return res;
    },
  );

  if (error) {
    return (
      <Box>
        <Typography>
          Error loading recipes
        </Typography>
      </Box>
    );
  }

  const handleClose = () => {
    setShow(false);
    setSearchQuery('');
  };

  const handleShowSearch = () => {
    setShow(false);
    setSearchQuery('');
  };

  const loadMoreLatestResults = () => {
    setLatestResultsToShow(latestResultsToShow + 8);
  };

  const loadMoreAllResults = () => {
    setAllResultsToShow(allResultsToShow + 8);
  };

  const loadMorePopularResults = () => {
    setPopularResultsToShow(popularResultsToShow + 8);
  };

  const loadMoreResults = () => {
    setResultsToShow(resultsToShow + 8);
  };

  function searchRecipes(searchTerm: string): IRecipe[] {
    // eslint-disable-next-line no-param-reassign
    searchTerm = searchTerm.toLowerCase();
    const recipes: IRecipe[] = [];

    const recipeTitleResults = allRecipes?.filter(
      (recipe: IRecipe) => recipe.title.toLowerCase().includes(searchTerm),
    ) ?? [];
    recipes.push(...recipeTitleResults);

    const ingredientResults = allRecipes?.filter((x) => x.ingredients.some(
      (ingredient: IRecipeIngredient) => ingredient.ingredientName.name
        .toLowerCase().includes(searchTerm),
    )) ?? [];

    ingredientResults?.forEach((recipe) => {
      if (!recipes.some((r) => r.id === recipe.id)) {
        recipes.push(recipe);
      }
    });

    return recipes;
  }

  useEffect(() => {
    if (open) {
      const fetchResults = () => {
        const results = searchRecipes(searchQuery);
        setSearchResults(results);
      };

      fetchResults();
    }
  }, [searchQuery]);

  const latestRecipes = [...allRecipes ?? []]
    .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

  const popularRecipes = [...allRecipes ?? []]
    .sort((a, b) => b.favorites - a.favorites);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}
      PaperProps={{
        sx: {
          zIndex: 9999,
          mt: 15,
          overflow: 'unset',
          maxHeight: '80vh', // Limits the height, making the dialog scrollable
          borderRadius: '12px', // Softens edges for a modern look
          backgroundColor: whiteBackground,
        },
      }}
      sx={{
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 9999,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* 🔹 Search Bar with Improved Styling */}
      <Box
        sx={{
          p: 3,
          borderBottom: `solid 1px ${theme.palette.divider}`,
          overflowY: 'auto',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputBase
              fullWidth
              autoFocus
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={(
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6B8E72' }} />
                  {' '}
                  {/* Matches site theme */}
                </InputAdornment>
              )}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: `1px solid ${primary}`,
                padding: '10px 14px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)', // Light subtle shadow
                '& .MuiOutlinedInput-root': {
                  background: whiteBackground, // Default border color
                },
                '& .MuiInputBase-input::placeholder': {
                  color: searchText,
                  fontStyle: 'italic',
                },
                '&:hover': {
                  borderColor: warmGold,
                },
                '&.Mui-focused': {
                  borderColor: warmGold,
                  boxShadow: '0px 2px 6px rgba(227, 183, 120, 0.3)', // Soft glow
                },
              }}
            />

          </Grid>

          {/* 🔹 "Top Results" Section */}
          {searchQuery.length > 0 && searchResults.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                fontFamily={straightFont}
                sx={{
                  color: primary,
                  fontWeight: '600',
                  mt: 2, // Add space below search bar
                }}
              >
                Top Results
              </Typography>
            </Grid>

            {/* 🔹 Recipe Cards with Better Spacing */}
            <Grid container spacing={1} sx={{ mt: 1, margin: '-4px' }}>
              {searchResults.slice(0, resultsToShow).map((recipe: IRecipe) => (
                <Grid item xs={6} sm={4} md={3} key={recipe.id}>
                  <RecipeMiniCard
                    recipe={recipe}
                    setShowSearch={handleShowSearch}
                  />
                </Grid>
              ))}
              {resultsToShow < searchResults.length && (
              <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                <Button
                  variant="contained"
                  onClick={loadMoreResults}
                  sx={{
                    backgroundColor: warmGold,
                    '&:hover': {
                      backgroundColor: darkGold, // Darker gold on hover
                      transform: 'scale(1.03)', // Slight pop effect
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                    },
                  }}
                >
                  Load More
                </Button>
              </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
          </>
          )}

          {/* 🔹 "Latest" Section */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              fontFamily={straightFont}
              sx={{
                color: primary,
                fontWeight: '600',
                mt: 2.5, // More spacing below search bar
                mb: 1.5, // Spacing before the results
              }}
            >
              Latest
            </Typography>
          </Grid>

          <Grid container spacing={1} sx={{ mt: 1, margin: '-4px' }}>
            {latestRecipes.slice(0, resultsToShow).map((recipe: IRecipe) => (
              <Grid item xs={12} sm={4} md={3} key={recipe.id}>
                <RecipeMiniCard
                  recipe={recipe}
                  setShowSearch={handleShowSearch}
                />
              </Grid>
            ))}
            <Grid item xs={12} justifyContent="center" alignItems="center">
              {latestResultsToShow < latestRecipes.length && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={loadMoreLatestResults}
                  sx={{
                    backgroundColor: warmGold,
                    '&:hover': {
                      backgroundColor: '#C28A45', // Darker gold on hover
                      transform: 'scale(1.03)', // Slight pop effect
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                    },
                  }}
                >
                  Load More
                </Button>
              </Box>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* 🔹 "Popular" Section */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              fontFamily={straightFont}
              sx={{
                color: primary,
                fontWeight: '600',
                mt: 2, // Add space below search bar
              }}
            >
              Popular Dishes
            </Typography>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {popularRecipes.slice(0, resultsToShow).map((recipe: IRecipe) => (
              <Grid item xs={12} sm={4} md={3} key={recipe.id}>
                <RecipeMiniCard
                  recipe={recipe}
                  setShowSearch={handleShowSearch}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} justifyContent="center" alignItems="center">
            {latestResultsToShow < latestRecipes.length && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={loadMorePopularResults}
                  sx={{
                    backgroundColor: warmGold,
                    '&:hover': {
                      backgroundColor: '#C28A45', // Darker gold on hover
                      transform: 'scale(1.03)', // Slight pop effect
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                    },
                  }}
                >
                  Load More
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* 🔹 "All Results" Section */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              fontFamily={straightFont}
              sx={{
                color: primary,
                fontWeight: '600',
                mt: 2, // Add space below search bar
              }}
            >
              All Results
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {allRecipes?.slice(0, allResultsToShow).map((recipe: IRecipe) => (
                <Grid item xs={12} sm={4} md={3} key={recipe.id}>
                  <RecipeMiniCard
                    recipe={recipe}
                    setShowSearch={handleShowSearch}
                  />
                </Grid>
              ))}
            </Grid>
            {allResultsToShow < (allRecipes?.length ?? 0) && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={loadMoreAllResults}
                sx={{
                  backgroundColor: warmGold,
                  '&:hover': {
                    backgroundColor: '#C28A45', // Darker gold on hover
                    transform: 'scale(1.03)', // Slight pop effect
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', // Soft shadow
                  },
                }}
              >
                Load More
              </Button>
            </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
