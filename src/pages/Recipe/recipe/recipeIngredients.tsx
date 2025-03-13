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
        <List sx={{ }}>
          {currentRecipe.ingredients?.map((ingredient) => (
            <ListItem
              key={ingredient.ingredientName.name}
              sx={{ height: '35px', fontFamily: 'Georgia, serif' }}
            >
              <Checkbox
                sx={{
                  color: unfavoritedColor,
                  '&.Mui-checked': {
                    color: primary,
                  },
                }}
              />
              {' '}
              {ingredient.amount.id === 'jxQQZOFSZ4Pg5Ck4SqS8' ? (
                <Typography variant="body1">
                  {ingredient.ingredientName.name}
                  {' '}
                  {ingredient.amount.name === 'none' ? '' : ingredient.amount.name}
                  {' '}
                  {ingredient.unit?.name}
                </Typography>
              )
                : (
                  <Typography variant="body1">
                    {ingredient.amount.name === 'none' ? '' : ingredient.amount.name}
                    {' '}
                    {ingredient.unit?.name}
                    {' '}
                    {ingredient.ingredientName.name}
                  </Typography>
                )}
              {ingredient.notes && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#6b6b6b' }}>
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
