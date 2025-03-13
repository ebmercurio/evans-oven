import { createContext } from 'react';
import IRecipe, { getDefault } from '../interfaces/IRecipe';

// Define the context type
interface RecipeContextType {
  currentRecipe: IRecipe;
  setCurrentRecipe: (recipe: IRecipe) => void;
}

// Create the context
const CurrentRecipeContext = createContext<RecipeContextType>({
  currentRecipe: getDefault(),
  setCurrentRecipe: () => {},
});

export default CurrentRecipeContext;
