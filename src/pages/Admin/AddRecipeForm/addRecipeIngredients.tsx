import { useQuery } from '@tanstack/react-query';
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

const defaultIngredient: IIngredient = {
  id: '',
  name: '',
};

const defaultAmount: IAmount = {
  id: '',
  name: '',
};

const defaultUnit: IUnit = {
  id: '',
  name: '',
};

const defaultNote: INote = {
  id: '',
  note: '',
};

export default function AddRecipeIngredients(props: AddRecipeIngredientsProps) {
  const { isSubmitting, finalIngredientsList } = props;

  const [ingredientsOptions, setIngredientsOptions] = useState<RHFSelectOption[]>([]);
  const [amountsOptions, setAmountsOptions] = useState<RHFSelectOption[]>([]);
  const [unitsOptions, setUnitsOptions] = useState<RHFSelectOption[]>([]);
  const [notesOptions, setNotesOptions] = useState<RHFSelectOption[]>([]);

  const [ingredientsList, setIngredientsList] = useState<IRecipeIngredient[]>([]);

  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient>(defaultIngredient);
  const [selectedAmount, setSelectedAmount] = useState<IAmount>(defaultAmount);
  const [selectedUnit, setSelectedUnit] = useState<IUnit>(defaultUnit);
  const [selectedNotes, setSelectedNotes] = useState<INote>(defaultNote);

  const { data: ingredientsData } = useQuery(['ingredients'], async () => {
    const res = await getAllUniqueIngredients();
    return res;
  });

  const { data: amountsData } = useQuery(['amounts'], async () => {
    const res = await getAllAmounts();
    return res;
  });

  const { data: unitsData } = useQuery(['units'], async () => {
    const res = await getAllUnits();
    return res;
  });

  const { data: notesData } = useQuery(['notes'], async () => {
    const res = await getAllNotes();
    return res;
  });

  const [error, setError] = useState<string>('');
  // const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  const sendIngredientsToParent = (finalizedList: IRecipeIngredient[]) => {
    finalIngredientsList(finalizedList);
  };

  useEffect(() => {
    const fetchIngredientsListOptions = async () => {
      if (!ingredientsData || !amountsData || !unitsData || !notesData) return;
      const transformedIngredients = transformIngredientsToOptions(ingredientsData)
        .sort((a, b) => a.label.localeCompare(b.label));

      setIngredientsOptions(transformedIngredients);

      const transformedAmounts = transformAmountsToOptions(amountsData)
        .sort((a, b) => a.label.localeCompare(b.label));
      setAmountsOptions(transformedAmounts);

      const transformedUnits = transformUnitsToOptions(unitsData)
        .sort((a, b) => a.label.localeCompare(b.label));
      setUnitsOptions(transformedUnits);

      const transformedNotes = transformNotesToOptions(notesData)
        .sort((a, b) => a.label.localeCompare(b.label));
      setNotesOptions(transformedNotes);
    };

    fetchIngredientsListOptions();
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
