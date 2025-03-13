import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { SxProps } from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface RHFSelectProps {
  name: string,
  label: string,
  native: boolean,
  maxHeight: number,
  options: { value: string; label: string }[],
  PaperPropsSx: SxProps,
  onChangeOptionValue: (value: string) => void;
}

export default function RHFSelect({
  name,
  native,
  label,
  maxHeight = 220,
  options,
  PaperPropsSx,
  onChangeOptionValue,
  ...other
}: RHFSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const { control } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChangeOptionValue(newValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          defaultValue=""
          value={selectedValue}
          onChange={handleChange}
          label={label}
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            sx: { textTransform: 'capitalize' },
          }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          <MenuItem disabled>
            Choose one
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
