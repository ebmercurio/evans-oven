import {
  Card, CardContent, Checkbox, List, ListItem, Typography,
} from '@mui/material';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import {
  unfavoritedColor,
  primary,
} from '../../../Constants';

export default function RecipeInfo() {
  const { currentRecipe } = useRecipeContext();

  return (
    <Card sx={{
      maxWidth: 'auto', backgroundColor: '#F8F1E4', borderRadius: 3, boxShadow: 3,
    }}
    >
      <CardContent>
        <Typography variant="h4" sx={{ fontFamily: 'Dancing Script', color: '#AD775F' }}>
          Ingredients
        </Typography>
        <List sx={{}}>
          {currentRecipe.ingredients?.map((ingredient) => (
            <ListItem
              key={ingredient.ingredientName.name}
              sx={{
                fontFamily: 'Georgia, serif',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 1,
                gap: 0.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Checkbox
                  sx={{
                    color: unfavoritedColor,
                    '&.Mui-checked': {
                      color: primary,
                    },
                    padding: '4px',
                    marginRight: '4px',
                  }}
                />
                {ingredient.amount.id === 'jxQQZOFSZ4Pg5Ck4SqS8' ? (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {ingredient.ingredientName.name}
                    {' '}
                    {ingredient.amount.name === 'none' ? '' : ingredient.amount.name}
                    {' '}
                    {ingredient.unit?.name}
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {ingredient.amount.name === 'none' ? '' : ingredient.amount.name}
                    {' '}
                    {ingredient.unit?.name}
                    {' '}
                    {ingredient.ingredientName.name}
                  </Typography>
                )}
              </div>
              {ingredient.notes && (
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    color: '#6b6b6b',
                    pl: 5, // Align with ingredient text
                    fontSize: '0.85rem',
                  }}
                >
                  (
                  {ingredient.notes.note}
                  )
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
