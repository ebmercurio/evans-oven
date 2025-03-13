import { useParams } from 'react-router-dom';
import {
  Box,
  Card, Container, Divider, Grid,
} from '@mui/material';
import RecipeImage from '../recipe/recipeImage';
import RecipeInfo from '../recipe/recipeInfo'; // Contains ingredients
import RecipeDetails from '../recipe/recipeDetails'; // Contains instructions, comments
import { CurrentRecipeProvider } from '../../../providers/CurrentRecipeProvider';
import { grey, whiteBackground } from '../../../Constants';

export default function RecipeView() {
  const { documentId } = useParams();

  return (
    <CurrentRecipeProvider documentId={documentId}>
      <Box sx={{ backgroundColor: whiteBackground }}>
        <Container sx={{ backgroundColor: whiteBackground }}>
          <Card sx={{ backgroundColor: whiteBackground }}>
            <Grid container spacing={1} display="flex">
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <RecipeImage />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  my: 2, display: 'flex', flexDirection: 'column',
                }}
              >
                <Card sx={{ padding: 2, backgroundColor: grey, height: '100%' }}>
                  <RecipeInfo />
                </Card>
              </Grid>
            </Grid>
            <Divider
              orientation="horizontal"
              flexItem
              sx={{
                borderBottomWidth: 2,
                borderColor: '#6B8E72',
                m: 2,
              }}
            />
            <RecipeDetails />
          </Card>
        </Container>
      </Box>
    </CurrentRecipeProvider>
  );
}
