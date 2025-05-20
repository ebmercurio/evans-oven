import {
  Box, IconButton, InputAdornment, TextField,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { warmerGold, warmGold } from '../../Constants';
import SearchBox from '../SearchBox';
import './SearchBar.css';

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
        backgroundColor: '#f8f6f2', // or a slightly warmed version of your cream background
        zIndex: 1300,
        display: { xs: 'flex' },
        justifyContent: 'center',
        boxShadow: '0px -2px 8px rgba(0,0,0,0.05)',
      }}
      className="pulsingSearch searchAnimate"
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
                borderColor: warmGold, // Default border color
              },
              '&:hover fieldset': {
                borderColor: warmerGold, // Hover state
              },
              '&.Mui-focused fieldset': {
                borderColor: warmerGold,
                boxShadow: '0px 2px 6px rgba(227, 183, 120, 0.3)', // Soft glow

              },
            },
            '& .MuiInputLabel-root': {
              color: warmGold, // Default label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: warmGold, // Changes floating label color on focus
            },
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: warmGold }} /></InputAdornment>,
          }}
        />
      </IconButton>
      <SearchBox open={search} setShow={() => setSearch(false)} />
    </Box>
  );
}
