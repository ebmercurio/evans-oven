import IInstructions from './IInstructions';
import IRecipeIngredient from './IRecipeIngredient';

export default interface IRecipe {
  averageRating: number,
  comments: string[],
  commentsWithRatings?: number,
  dateCreated: string,
  favorites: number,
  id: string,
  image: string,
  ingredients: IRecipeIngredient[],
  instructions: IInstructions[],
  servings: string,
  tags: string[],
  title: string,
  totalStars?: number,
}

export const getDefault = (): IRecipe => ({
  averageRating: 0,
  comments: [],
  commentsWithRatings: 0,
  dateCreated: '',
  favorites: 0,
  id: '',
  image: '',
  instructions: [],
  ingredients: [],
  servings: '',
  tags: [],
  title: '',
  totalStars: 0,
});
