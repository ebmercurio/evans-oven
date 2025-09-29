import { Navigate } from 'react-router-dom';
import {
  Box,
  Button, Container, Grid, Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import { useQuery } from '@tanstack/react-query';
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

  if (!currentUser || currentUser.email !== 'ebmercurio@gmail.com') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (!ingredientsData || !amountsData || !unitsData || !notesData) return;
    const setIngredientsListOptions = async () => {
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

    setIngredientsListOptions();
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
