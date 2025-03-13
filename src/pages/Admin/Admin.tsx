import { Navigate } from 'react-router-dom';
import {
  Box,
  Button, Container, Grid, Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import { useAuth } from '../../contexts/AuthContext';
import AddRecipeForm from './AddRecipeForm/addRecipeForm';
import { whiteBackground } from '../../Constants';
import CreateIngredientParts from './AddRecipeForm/createIngredientParts';
import { RHFSelectOption } from '../../interfaces/RHFSelectOption';
import {
  getAllUniqueIngredients,
  transformIngredientsToOptions,
  getAllAmounts,
  transformAmountsToOptions,
  getAllUnits,
  transformUnitsToOptions,
  getAllNotes,
  transformNotesToOptions,
} from '../../services/DbService';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [openAddRecipeForm, setOpenAddRecipeForm] = useState<boolean>(false);
  const [ingredientsOptions, setIngredientsOptions] = useState<RHFSelectOption[]>([]);
  const [amountsOptions, setAmountsOptions] = useState<RHFSelectOption[]>([]);
  const [unitsOptions, setUnitsOptions] = useState<RHFSelectOption[]>([]);
  const [notesOptions, setNotesOptions] = useState<RHFSelectOption[]>([]);

  if (!currentUser || currentUser.email !== 'ebmercurio@gmail.com') {
    console.log(currentUser?.email, 'email');
    return <Navigate to="/" replace />;
  }

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

  return (
    <Box sx={{ backgroundColor: whiteBackground, my: 2 }}>
      <Container>
        <Grid item xs={12} sx={{ display: 'flex', borderBottom: '1px grey dashed' }}>
          <Stack alignItems="center" justifyContent="center" sx={{ py: { xs: 5, md: 0 } }}>
            <Button
              size="large"
              color="inherit"
              onClick={() => setOpenAddRecipeForm(true)}
              startIcon={<CreateIcon />}
            >
              Make a Recipe
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={11}>
            <CreateIngredientParts
              ingredientsOptions={ingredientsOptions}
              amountsOptions={amountsOptions}
              unitsOptions={unitsOptions}
              notesOptions={notesOptions}
            />
          </Grid>
        </Grid>

        {openAddRecipeForm && (
        <AddRecipeForm
          openBool={openAddRecipeForm}
          onClose={() => setOpenAddRecipeForm(false)}
        />
        )}
      </Container>
    </Box>
  );
}
