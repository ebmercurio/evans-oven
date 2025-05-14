import {
  Box, IconButton, InputAdornment, TextField,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  blackText, primary, warmGold, whiteBackground,
} from '../../Constants';
import SearchBox from '../SearchBox';

export default function SearchBar() {
  const [search, setSearch] = useState<boolean>(false);

  return (
    <Box
      sx={{
        position: { xs: 'fixed', sm: 'static' },
        bottom: { xs: 0, sm: 'auto' },
        width: { xs: '98vw', sm: '500px' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        backgroundColor: whiteBackground,
        zIndex: 1300,
        display: { xs: 'flex' },
        justifyContent: 'center',
      }}
    >
      <IconButton onClick={() => setSearch(true)}>
        <TextField
          id="SearchBar"
          variant="outlined"
          label="Search All Recipes"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: primary, // Default border color
              },
              '&:hover fieldset': {
                borderColor: warmGold, // Hover state
              },
              '&.Mui-focused fieldset': {
                borderColor: warmGold,
                boxShadow: '0px 2px 6px rgba(227, 183, 120, 0.3)', // Soft glow

              },
            },
            '& .MuiInputLabel-root': {
              color: blackText, // Default label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: primary, // Changes floating label color on focus
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
      </IconButton>
      <SearchBox open={search} setShow={() => setSearch(false)} />
    </Box>
  );
}
