import {
  Box, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel,
} from '@mui/material';
import { blackText, primary, warmGold } from '../../../Constants';

interface CommentSortControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function CommentSortControls({ sortBy, onSortChange }: CommentSortControlsProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 200, mb: 3 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="comment-sort-label" sx={{ color: blackText }}>
          Sort by
        </InputLabel>
        <Select
          labelId="comment-sort-label"
          id="comment-sort"
          value={sortBy}
          label="Sort by"
          onChange={handleChange}
          sx={{
            color: blackText,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: primary,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: warmGold,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: warmGold,
            },
            '& .MuiSvgIcon-root': {
              color: primary,
            },
          }}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
          <MenuItem value="rating">Highest Rating</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
