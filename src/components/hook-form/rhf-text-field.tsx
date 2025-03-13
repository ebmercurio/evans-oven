import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

interface RHFTextFieldProps {
  name: string;
  [key: string]: any; // Allow any additional props
}

export default function RHFTextField({
  name, ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          label={name} /* Use name as label or adjust as needed */
          // helperText={helperText}
          {...other}
        />
      )}
    />
  );
}
