import {
  Box,
  Container,
} from '@mui/material';
import RecipesByTag from '../recipesByTag';
import { whiteBackground } from '../../../../Constants';

export default function RecipesByTagView() {
  return (
    <Box sx={{ backgroundColor: whiteBackground }}>
      <Container>
        <RecipesByTag />
      </Container>
    </Box>
  );
}
