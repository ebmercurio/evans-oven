import {
  Grid, Typography, Checkbox,
  Box,
} from '@mui/material';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import {
  // accentColor,
  cardBackground,
  featureItemText,
  primary,
  secondary,
  straightFont,
  unfavoritedColor,
  // white,
  // whiteBackground,
} from '../../../Constants';

export default function RecipeInstructions() {
  const { currentRecipe } = useRecipeContext();

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {currentRecipe.instructions?.map((step) => (
        <Grid
          item
          xs={12}
          key={step.stepNumber}
          container
          alignItems="center"
          sx={{
            backgroundColor: cardBackground,
            padding: 2,
            borderRadius: '10px',
            boxShadow: `0px 2px 4px ${primary}`,
            mb: 2,
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: `0px 2px 6px ${primary}`,
            },
          }}
        >
          <Checkbox
            sx={{
              ml: 2,
              color: unfavoritedColor,
              '&.Mui-checked': {
                color: primary,
              },
            }}
          />
          <Typography sx={{
            flexShrink: 0,
            background: secondary,
            color: cardBackground,
            fontFamily: straightFont,
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '20px',
          }}
          >
            Step
            {' '}
            {step.stepNumber}
            :
          </Typography>
          <Box>
            <Typography sx={{
              ml: 2, fontSize: '1rem', fontWeight: 500, fontFamily: straightFont,
            }}
            >
              {step.description}
            </Typography>

            {step.duration && (
              <Typography sx={{
                ml: 2, fontSize: '0.9rem', fontWeight: 400, color: featureItemText,
              }}
              >
                (
                {step.duration}
                )
              </Typography>
            )}
            {step.tip && (
              <Typography sx={{
                background: '#FDF1E3',
                // ml: 2,
                padding: '6px 12px',
                borderRadius: '6px',
                fontStyle: 'italic',
                // color: accentColor,
                // mt: 1,
              }}
              >
                Tip:
                {' '}
                {step.tip}
              </Typography>
            )}
          </Box>
        </Grid>

      ))}
    </Grid>
  );
}
