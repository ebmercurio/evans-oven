/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import IRecipe, { getDefault } from '../interfaces/IRecipe';
import { getRecipeById } from '../services/DbService';
import CurrentRecipeContext from '../contexts/RecipeContext';
import ErrorDialog from '../components/ErrorDialog';

interface ICurrentRecipeProviderProps {
  documentId: string | undefined;
  children: React.ReactNode;
}

export function CurrentRecipeProvider(props: ICurrentRecipeProviderProps) {
  const { children, documentId } = props;
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorOpen, setErrorOpen] = useState<boolean>(false);

  const {
    data: currentRecipe = getDefault(), // fallback to default while loading
  } = useQuery<IRecipe>(
    ['recipe', documentId],
    () => {
      if (!documentId) throw new Error('Document ID is required');
      return getRecipeById(documentId);
    },
    {
      enabled: !!documentId,
      onError: (err: unknown) => {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('An unknown error occurred.');
        }
        setErrorOpen(true);
      },
    },
  );

  const currentRecipeContextValue = useMemo(
    () => ({
      currentRecipe,
      setCurrentRecipe: () => {
        console.warn('setCurrentRecipe is not available when using react-query only.');
      },
    }),
    [currentRecipe],
  );

  return (
    <>
      <ErrorDialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        errorResponse={undefined}
        customErrorMessage={errorMessage}
      />
      <CurrentRecipeContext.Provider value={currentRecipeContextValue}>
        {children}
      </CurrentRecipeContext.Provider>
    </>
  );
}

export const useRecipeContext = () => React.useContext(CurrentRecipeContext);
