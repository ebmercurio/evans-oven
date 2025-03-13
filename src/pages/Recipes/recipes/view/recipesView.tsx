import {
  Box,
  Container,
} from '@mui/material';
import RecipesMain from '../recipesMain';
import { whiteBackground } from '../../../../Constants';

export default function RecipesView() {
  return (
    <Box sx={{ backgroundColor: whiteBackground }}>
      <Container>
        <RecipesMain />
      </Container>
    </Box>
  );
}
