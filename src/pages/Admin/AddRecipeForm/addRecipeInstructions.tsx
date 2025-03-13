import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Grid, TextField } from '@mui/material';

export default function AddRecipeInstructions() {
  const { control, register } = useFormContext(); // Access form methods from FormProvider
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions', // This will manage an array of instructions
  });

  return (
    <>
      {fields.map((field, index) => (
        <Grid container key={field.id} spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register(`instructions.${index}.stepNumber`)}
              label={`Step ${index + 1} Number`}
              type="number"
              fullWidth
              defaultValue={index + 1} // Auto-numbering the steps
              InputProps={{ readOnly: true }} // Making it read-only to maintain order
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              {...register(`instructions.${index}.description`)}
              label="Step Description"
              multiline
              rows={3}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register(`instructions.${index}.duration`)}
              label="Duration (Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register(`instructions.${index}.tip`)}
              label="Tip (Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="error" onClick={() => remove(index)}>
              Remove Step
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => append({
          stepNumber: fields.length + 1, description: '', duration: '', tip: '',
        })}
      >
        Add Step
      </Button>
    </>
  );
}
