import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Grid, Typography, Button, MenuList, MenuItem,
  Alert,
  Box,
} from '@mui/material';
import RHFSelect from '../../../components/hook-form/rhf-select';
import IRecipeIngredient from '../../../interfaces/IRecipeIngredient';
import { RHFSelectOption } from '../../../interfaces/RHFSelectOption';
import {
  getAllUniqueIngredients,
  transformIngredientsToOptions,
  getAllAmounts,
  transformAmountsToOptions,
  getAllNotes,
  transformNotesToOptions,
  getIngredientById,
  getAmountById,
  getIngredientNotesById,
  getUnitById,
  getAllUnits,
  transformUnitsToOptions,
} from '../../../services/DbService';
import IAmount from '../../../interfaces/IAmount';
import IIngredient from '../../../interfaces/IIngredient';
import INote from '../../../interfaces/INote';
import { grey } from '../../../Constants';
import IUnit from '../../../interfaces/IUnit';

interface AddRecipeIngredientsProps {
  isSubmitting: boolean
  finalIngredientsList: (recipeIngredients: IRecipeIngredient[]) => void;
}

export default function AddRecipeIngredients(props: AddRecipeIngredientsProps) {
  const { isSubmitting, finalIngredientsList } = props;

  const [ingredientsOptions, setIngredientsOptions] = useState<RHFSelectOption[]>([]);
  const [amountsOptions, setAmountsOptions] = useState<RHFSelectOption[]>([]);
  const [unitsOptions, setUnitsOptions] = useState<RHFSelectOption[]>([]);
  const [notesOptions, setNotesOptions] = useState<RHFSelectOption[]>([]);

  const [ingredientsList, setIngredientsList] = useState<IRecipeIngredient[]>([]);

  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient>(null!);
  const [selectedAmount, setSelectedAmount] = useState<IAmount>(null!);
  const [selectedUnit, setSelectedUnit] = useState<IUnit>(null!);
  const [selectedNotes, setSelectedNotes] = useState<INote>(null!);

  const [error, setError] = useState<string>('');
  // const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  const sendIngredientsToParent = (finalizedList: IRecipeIngredient[]) => {
    finalIngredientsList(finalizedList);
  };

  useEffect(() => {
    const fetchIngredientsListOptions = async () => {
      const fetchedIngredients = await getAllUniqueIngredients();
      const transformedIngredients = transformIngredientsToOptions(fetchedIngredients)
        .sort((a, b) => a.label.localeCompare(b.label));

      setIngredientsOptions(transformedIngredients);

      const fetchedAmounts = await getAllAmounts();
      const transformedAmounts = transformAmountsToOptions(fetchedAmounts)
        .sort((a, b) => a.label.localeCompare(b.label));
      setAmountsOptions(transformedAmounts);

      const fetchedUnits = await getAllUnits();
      const transformedUnits = transformUnitsToOptions(fetchedUnits)
        .sort((a, b) => a.label.localeCompare(b.label));
      setUnitsOptions(transformedUnits);

      const fetchedNotes = await getAllNotes();
      const transformedNotes = transformNotesToOptions(fetchedNotes)
        .sort((a, b) => a.label.localeCompare(b.label));
      setNotesOptions(transformedNotes);
    };

    fetchIngredientsListOptions();

    console.log(unitsOptions, 'unitsoptions');
  }, []);

  const handleIngredientChange = async (value: string) => {
    // setOpenTooltip(false);
    const ingredient = await getIngredientById(value);
    if (ingredient != null) {
      await setSelectedIngredient(ingredient);
    }
  };

  const handleAmountChange = async (value: string) => {
    const amount = await getAmountById(value);
    setSelectedAmount(amount);
  };

  const handleNotesChange = async (value: string) => {
    const note = await getIngredientNotesById(value);
    setSelectedNotes(note);
  };

  const handleUnitChange = async (value: string) => {
    const unit = await getUnitById(value);
    console.log(unit, 'unit');
    setSelectedUnit(unit);
  };

  const createRecipeIngredient = () => {
    const ingredientObject: IRecipeIngredient = {
      amount: selectedAmount,
      notes: selectedNotes.note === 'none' ? null : selectedNotes,
      ingredientName: selectedIngredient,
      unit: selectedUnit.name === 'none' ? null : selectedUnit,
    };

    const isDuplicate = ingredientsList.some(
      (ingredient) => ingredient.ingredientName === selectedIngredient,
    );
    if (ingredientObject.amount) {
      if (!isDuplicate) {
        // Use the callback function with setIngredientsList
        setIngredientsList((prevIngredientsList) => {
          const updatedList = [...prevIngredientsList, ingredientObject];
          sendIngredientsToParent(updatedList);

          return updatedList; // Return the updated list to update the state
        });
        // setOpenTooltip(false);
      } else {
        setError('Duplicate ingredient');
        // setOpenTooltip(true);
      }
    } else {
      setError('Requires Ingredient & Amount');
      // setOpenTooltip(true);
    }
  };

  const handleRemoveIngredientItem = (ingredient: IRecipeIngredient) => {
    const newArray = [...ingredientsList.filter((ingredientItem) => ingredientItem !== ingredient)];
    setIngredientsList(newArray);
  };

  useEffect(() => {
  }, [selectedIngredient, selectedAmount, selectedNotes, selectedUnit]);

  return (
    <Grid container spacing={1} id="ingredientsBox" sx={{ my: 1, backgroundColor: grey }}>
      <Grid item xs={12}>
        <Typography>Ingredients Builder:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button>
          Clear Ingredient
        </Button>
      </Grid>
      <Grid item xs={4} sx={{ my: 1 }}>
        <RHFSelect
          name="ingredients"
          label="Ingredients *"
          native={false}
          maxHeight={220}
          options={ingredientsOptions}
          PaperPropsSx={{ mt: 3, width: '500px' }}
          onChangeOptionValue={handleIngredientChange}
        />
      </Grid>
      <Grid item xs={4} sx={{ my: 1 }}>
        <RHFSelect
          name="amounts"
          label="Amounts *"
          native={false}
          maxHeight={220}
          options={amountsOptions}
          PaperPropsSx={{ mt: 3, width: '500px' }}
          onChangeOptionValue={handleAmountChange}
        />
      </Grid>
      <Grid item xs={4} sx={{ my: 1 }}>
        <RHFSelect
          name="units"
          label="Units *"
          native={false}
          maxHeight={220}
          options={unitsOptions}
          PaperPropsSx={{ mt: 3, width: '500px' }}
          onChangeOptionValue={handleUnitChange}
        />
      </Grid>
      <Grid item xs={4} sx={{ my: 1 }}>
        <RHFSelect
          name="notes"
          label="Notes"
          native={false}
          maxHeight={220}
          options={notesOptions}
          PaperPropsSx={{ mt: 3, width: '500px' }}
          onChangeOptionValue={handleNotesChange}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButton variant="contained" loading={isSubmitting} onClick={createRecipeIngredient}>
          Add Ingredient to List
        </LoadingButton>
      </Grid>
      <Grid item xs={12}>
        <Typography>Ingredients List:</Typography>
      </Grid>
      <MenuList>
        {ingredientsList.map((ingredient: IRecipeIngredient) => (
          <Grid container key={ingredient.ingredientName.id}>
            <Grid item xs={10}>
              <MenuItem key={ingredient.ingredientName.id}>
                {ingredient.ingredientName.name}
                {' '}
                {ingredient.amount.name}
                {' '}
                {ingredient.unit?.name}
                {' '}
                {ingredient.notes?.note}
              </MenuItem>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={() => handleRemoveIngredientItem(ingredient)}>Delete</Button>
            </Grid>
          </Grid>
        ))}
      </MenuList>
      {error && (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
      )}
    </Grid>
  );
}
