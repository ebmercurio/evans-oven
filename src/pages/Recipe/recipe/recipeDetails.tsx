import { useState } from 'react';
import {
  Box, Container, Grid, Tabs, Tab, styled, Typography,
} from '@mui/material';
import { searchText, secondary, whiteBackground } from '../../../Constants';
import RecipeInstructions from './recipeInstructions'; // Contains instructions
import RecipeComments from './recipeCommentsTab'; // Contains comments section

const StyledTabs = styled(Tabs)({
  borderBottom: `2px solid ${secondary}`,
  '& .MuiTab-root': {
    minWidth: 'auto',
    marginRight: '16px',
    color: searchText,
    fontWeight: 'bold',
    fontSize: { xs: '0.9rem', sm: '1rem' },
    textTransform: 'uppercase',
    flex: { xs: 1, sm: 'none' },
    padding: { xs: '12px 8px', sm: '12px 16px' },
  },
  '@media (max-width: 600px)': {
    width: '100%',
    display: 'flex',
    '& .MuiTabs-flexContainer': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  '& .MuiTab-root.Mui-selected': {
    color: secondary,
    borderBottom: `3px solid ${secondary}`,

  },
  '& .MuiTabs-indicator': {
    backgroundColor: secondary,
  },
});

export default function RecipeDetails() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  return (
    <Box sx={{
      backgroundColor: whiteBackground,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '48px 16px',
    }}
    >
      <Container>
        {/* Tabs for switching between sections like Instructions, Comments, etc. */}
        <StyledTabs value={selectedTabIndex} onChange={handleTabChange}>
          <Tab label="Instructions" />
          <Tab label="Comments" />
          {/* Add more tabs if needed */}
        </StyledTabs>

        <Box sx={{ marginTop: '24px' }}>
          {/* Render content based on selected tab */}
          {selectedTabIndex === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                  Recipe Instructions
                </Typography>
                <RecipeInstructions />
              </Grid>
            </Grid>
          )}

          {selectedTabIndex === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                  Comments
                </Typography>
                <RecipeComments />
              </Grid>
            </Grid>
          )}

          {/* Add more sections for other tabs as needed */}
        </Box>
      </Container>
    </Box>
  );
}
