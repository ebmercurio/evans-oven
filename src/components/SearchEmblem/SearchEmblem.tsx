import {
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { primary } from '../../Constants';
import SearchBox from '../SearchBox';

export default function SearchEmblem() {
  const [search, setSearch] = useState<boolean>(false);

  return (
    <>
      <IconButton style={{ marginRight: 1 }} onClick={() => setSearch(true)}>
        <SearchIcon sx={{ color: primary }} />
      </IconButton>

      <SearchBox open={search} setShow={() => setSearch(false)} />
    </>
  );
}
