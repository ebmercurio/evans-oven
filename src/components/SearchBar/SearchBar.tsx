import { useState } from 'react';
import {
  Autocomplete,
  Box, createFilterOptions, FilterOptionsState, InputAdornment, TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import {
  espressoBrown, darkGold, warmGold, straightFont,
} from '../../Constants';
import './SearchBar.css';
import { getAllRecipes } from '../../services/DbService';
import IRecipe from '../../interfaces/IRecipe';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { data: allRecipes, error } = useQuery(
    ['allRecipes'],
    async () => {
      const res = await getAllRecipes();
      return res;
    },
    {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  );

  const baseFilter = createFilterOptions<IRecipe>({
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
    stringify: (option) => {
      const tagString = option.tags?.join(' ') || '';
      return `${option.title} ${tagString}`;
    },
  });

  const filterOptions = (options: IRecipe[], state: FilterOptionsState<IRecipe>) => {
    const input = state.inputValue.trim();
    if (!input) return [];
    return baseFilter(options, { ...state }); // Spread the full state so TS is happy
  };

  if (error) {
    console.error('Error fetching recipes:', error);
    return <div>Error loading recipes</div>;
  }

  if (!allRecipes) {
    return <div>Loading recipes...</div>;
  }

  return (
    <Box sx={{
      width: '100%', maxWidth: 600, margin: '0 auto', py: '16px',
    }}
    >
      <Autocomplete
        freeSolo
        id="searchBar"
        disableClearable
        options={allRecipes}
        filterOptions={filterOptions}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f6f2'; // soft hover
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src={option.image}
              alt={option.title}
              width={36}
              height={36}
              style={{
                objectFit: 'cover',
                borderRadius: '8px',
                marginRight: 12,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <Typography sx={{ fontFamily: straightFont, color: espressoBrown }}>
              {option.title}
            </Typography>
          </li>
        )}
        sx={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          borderRadius: '12px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: warmGold,
            },
            '&:hover fieldset': {
              borderColor: darkGold,
            },
            '&.Mui-focused fieldset': {
              borderColor: darkGold,
            },
            '& .MuiInputLabel-root': {
              color: espressoBrown, // Default label color
            },
          },
          '& .MuiInputLabel-root': {
            color: espressoBrown, // Default label color
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="What are you craving?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            sx={{
              color: espressoBrown,
              fontFamily: straightFont,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: warmGold,
                },
                '&:hover fieldset': {
                  borderColor: darkGold,
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkGold,
                  color: espressoBrown, // Focused label color
                },
                '& .MuiInputLabel-root': {
                  color: espressoBrown, // Default label color
                },
              },
              '& .MuiInputLabel-root': {
                color: espressoBrown, // Default label color
              },
              '& label.Mui-focused': {
                color: espressoBrown, // Focused label color
              },
            }}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: warmGold }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: isFocused || inputValue !== '',
              sx: {
                color: espressoBrown,
                marginLeft: isFocused ? 0 : '36px', // enough to clear the search icon space
              },
            }}
          />
        )}
      />
    </Box>
  );
}
