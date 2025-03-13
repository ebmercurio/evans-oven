/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box, Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent,
} from '@mui/material';
import { RHFSelectOption } from '../../../interfaces/RHFSelectOption';
import ITag from '../../../interfaces/ITag';
import { getAllTags, transformTagsToOptions } from '../../../services/DbService';

interface AddRecipeTagsProps {
  finalTagsList: (recipeTags: string[]) => void;
}

export default function AddRecipeTags({
  finalTagsList,
}: AddRecipeTagsProps) {
  const [tagsOptions, setTagsOptions] = useState<RHFSelectOption[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTagOptions = async () => {
      try {
        const fetchedTags = await getAllTags();
        if (isMounted) {
          const transformedTags = transformTagsToOptions(fetchedTags);
          setTagsOptions(transformedTags);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTagOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedIds = event.target.value as string[];
    setSelectedTagIds(selectedIds);
    const selectedTags = tagsOptions.filter((option) => selectedIds.includes(option.value))
      .map((option) => ({ id: option.value, name: option.label }));
    finalTagsList(selectedIds);
  };

  return (
    <FormControl>
      <InputLabel>Tags*</InputLabel>
      <Select
        placeholder="Tags"
        multiple
        fullWidth
        value={selectedTagIds}
        onChange={handleChange}
        sx={{
          width: '500px',
        }}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedTagIds.map((tagId) => (
              <Chip
                key={tagId}
                label={tagsOptions.find((option) => option.value === tagId)?.label}
              />
            ))}
          </Box>
        )}
      >
        {tagsOptions.map((tagOption: RHFSelectOption) => (
          <MenuItem key={tagOption.value} value={tagOption.value}>
            {tagOption.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
