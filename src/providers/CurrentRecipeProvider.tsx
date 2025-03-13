import React, { useEffect, useMemo, useState } from 'react';
import { ErrorMessageInterface } from '../components/ErrorDialog/ErrorMessageInterface';
import IRecipe, { getDefault } from '../interfaces/IRecipe';
import { getRecipeById } from '../services/DbService';
import CurrentRecipeContext from '../contexts/RecipeContext';
import ErrorDialog from '../components/ErrorDialog';

interface ICurrentRecipeProviderProps {
  documentId: string | undefined;
  children: React.ReactNode;
}

const defaultRecipeObject = getDefault();

export function CurrentRecipeProvider(props: ICurrentRecipeProviderProps) {
  const { children, documentId } = props;
  const [errorMessage, setErrorMessage] = useState<ErrorMessageInterface>();
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<IRecipe>(defaultRecipeObject);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (documentId) {
        try {
          const recipeData = await getRecipeById(documentId);
          if (recipeData) {
            setRecipe(recipeData);
          }
        } catch (error: any) {
          setErrorOpen(true);
          setErrorMessage(error.message);
        }
      }
    };
    fetchRecipe();
  }, [documentId]);

  const currentRecipeContextValue = useMemo(
    () => ({
      currentRecipe: recipe,
      setCurrentRecipe: (updatedRecipe: IRecipe) => setRecipe(updatedRecipe),
    }),
    [recipe],
  );

  return (
    <>
      <ErrorDialog
        open={errorOpen}
        onClose={() => setErrorOpen(!errorOpen)}
        errorResponse={errorMessage}
      />
      <CurrentRecipeContext.Provider value={currentRecipeContextValue}>
        {children}
      </CurrentRecipeContext.Provider>
    </>
  );
}

export const useRecipeContext = () => React.useContext(CurrentRecipeContext);
