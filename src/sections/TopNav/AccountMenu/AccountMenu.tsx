import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box, Avatar, Divider, IconButton, MenuItem, Stack, Typography,
  Alert,
} from '@mui/material/';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CustomPopover from '../../../components/custom-popover';
import useRouter from '../../../hooks/use-router';
import { useAuth } from '../../../contexts/AuthContext';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/home',
  },
  {
    label: 'Profile',
    linkTo: '/me',
  },
  {
    label: 'Favorites',
    linkTo: '/myFavorites',
  },
];

export default function AccountMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      if (window.location.href.includes('/me')) {
        router.push('/');
      }
      setOpen(false);
    } catch {
      setError('Failed to logout');
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClickItem = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleOpenModal = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
        }}

      >
        {currentUser ? (
          <Avatar
            src={currentUser.photoURL ?? ''}
            alt={currentUser.displayName ?? ''}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          />
        ) : (
          <AccountCircleIcon fontSize="large" />
        )}

      </IconButton>

      <CustomPopover
        open={open}
        closePopover={handleClose}
        anchorEl={anchorEl}
        sx={{ width: 200, p: 0 }}
      >
        {currentUser && (

          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle2" noWrap>
              {currentUser.displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {currentUser.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {currentUser ? (
          <MenuItem
            onClick={handleLogout}
            sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
          >
            Logout
          </MenuItem>
        )
          : (
            <MenuItem
              onClick={() => handleOpenModal()}
              sx={{ m: 1, fontWeight: 'bold', color: 'success.main' }}
            >
              Login
            </MenuItem>
          )}
        {error && (

          <Alert>{error}</Alert>
        )}
      </CustomPopover>
    </>
  );
}
