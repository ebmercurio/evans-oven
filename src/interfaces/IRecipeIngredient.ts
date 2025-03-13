import IAmount from './IAmount';
import IIngredient from './IIngredient';
import INote from './INote';
import IUnit from './IUnit';

export default interface IRecipeIngredient {
  amount: IAmount,
  notes?: INote | null,
  ingredientName: IIngredient,
  unit?: IUnit | null,
}
