import {
  Grid, TextField, Button, Typography, AccordionDetails,
  Alert,
  Box,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, ChangeEvent } from 'react';
import {
  addAmount, addIngredient, addNote, addUnit,
} from '../../../services/DbService';
import { RHFSelectOption } from '../../../interfaces/RHFSelectOption';

interface CreateIngredientPartsProps {
  ingredientsOptions: RHFSelectOption[],
  amountsOptions: RHFSelectOption[],
  unitsOptions: RHFSelectOption[],
  notesOptions: RHFSelectOption[],
}

export default function CreateIngredientParts(props: CreateIngredientPartsProps) {
  const {
    ingredientsOptions, amountsOptions, notesOptions, unitsOptions,
  } = props;
  const [newIngredientValue, setNewIngredientValue] = useState<string>('');
  const [newAmountValue, setNewAmountValue] = useState<string>('');
  const [newUnitValue, setNewUnitValue] = useState<string>('');
  const [newNoteValue, setNewNoteValue] = useState<string>('');
  // const [openTooltip, setOpenTooltip] = useState<boolean>();
  const [error, setError] = useState<string>('');

  const handleIngredientValueChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setNewIngredientValue(newValue);
  };
  const handleAmountValueChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setNewAmountValue(newValue);
  };
  const handleUnitValueChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setNewUnitValue(newValue);
  };
  const handleNoteValueChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setNewNoteValue(newValue);
  };

  const handleCreateIngredient = () => {
    if (!ingredientsOptions.some((x) => x.label === newIngredientValue)) {
      addIngredient(newIngredientValue);
      setNewIngredientValue('');
    } else {
      setNewIngredientValue('');
      setError('Dupe');
    }
  };
  const handleCreateAmount = () => {
    if (!amountsOptions.some((x) => x.label === newAmountValue)) {
      addAmount(newAmountValue);
      setNewAmountValue('');
    } else {
      setNewAmountValue('');
      setError('Dupe');
    }
  };
  const handleCreateUnit = () => {
    console.log(newUnitValue, 'value');
    console.log(unitsOptions, 'value');
    if (!unitsOptions.some((x) => x.label === newUnitValue)) {
      console.log('here');
      addUnit(newUnitValue);
      setNewUnitValue('');
    } else {
      setError('Dupe');
      setNewUnitValue('');
    }
  };
  const handleCreateNote = () => {
    if (!notesOptions.some((x) => x.label === newNoteValue)) {
      console.log('here');
      addNote(newNoteValue);
      setNewNoteValue('');
    } else {
      setNewNoteValue('');
      setError('Dupe');
    }
  };
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Create New Ingredient Parts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField
              name="createIngredient"
              label="Create Ingredient"
              value={newIngredientValue}
              onChange={handleIngredientValueChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="createAmount"
              label="Create Amount"
              value={newAmountValue}
              onChange={handleAmountValueChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="createUnit"
              label="Create Unit"
              value={newUnitValue}
              onChange={handleUnitValueChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="createNote"
              label="Create Note"
              value={newNoteValue}
              onChange={handleNoteValueChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" onClick={handleCreateIngredient}>
              Create New Ingredient
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" onClick={handleCreateAmount}>
              Create New Amount
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" onClick={handleCreateUnit}>
              Create New Unit
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" onClick={handleCreateNote}>
              Create New Note
            </Button>
          </Grid>
          {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
