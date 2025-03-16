import {
  Alert,
  Box, Button, Grid, TextField, Typography,
} from '@mui/material';
import {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import {
  blackText,
  cancelColor, primary, straightFont, whiteBackground,
} from '../../../Constants';
import GenericDialog from '../../GenericDialog';
import { useAuth } from '../../../contexts/AuthContext';

interface ISignupProps {
  showSignup: boolean;
  setShowSignup: Dispatch<SetStateAction<boolean>>;
  setShowLogin: Dispatch<SetStateAction<boolean>>;
}

export default function Signup(props: ISignupProps) {
  const { showSignup, setShowSignup, setShowLogin } = props;
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signup } = useAuth();

  const closeModal = () => {
    setShowSignup(false);
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      signup(email, password, displayName);
      setShowSignup(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    closeModal();
    setShowLogin(true);
  };

  useEffect(() => {
    if (showSignup) {
      setError(''); // Reset error message when the modal is opened
    }
  }, [showSignup]);

  return (
    <GenericDialog
      open={showSignup}
      closeModal={closeModal}
      isLoading={loading}
    >
      <Box sx={{ padding: 2, maxWidth: 400, backgroundColor: whiteBackground }}>
        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontFamily: straightFont, fontWeight: 'bold' }}>
              Sign Up
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Display Name"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{
                width: '100%',
                color: blackText,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Focus state (removes default blue)
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: blackText, // Default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: primary, // Changes floating label color on focus
                },
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                width: '100%',
                color: blackText,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Focus state (removes default blue)
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: blackText, // Default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: primary, // Changes floating label color on focus
                },
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                width: '100%',
                color: blackText,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Focus state (removes default blue)
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: blackText, // Default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: primary, // Changes floating label color on focus
                },
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                width: '100%',
                color: blackText,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Focus state (removes default blue)
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: blackText, // Default label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: primary, // Changes floating label color on focus
                },
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={closeModal}
              sx={{
                mr: 1,
                mb: 1,
                color: cancelColor, // Text color
                borderColor: cancelColor, // Outline color
                '&:hover': {
                  backgroundColor: 'rgba(200, 116, 80, 0.2)',
                  borderColor: cancelColor, // Fills button with your cancel color on hover
                  color: cancelColor, // Ensures text stays readable
                  opacity: 0.8, // Creates a soft "see-through" effect
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mx: 1,
                mb: 1,
                backgroundColor: primary,
                '&:hover': {
                  backgroundColor: primary, // Fills button with your primary color on hover
                  opacity: 0.8, // Creates a soft "see-through" effect
                },
              }}
            >
              Sign Up
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={handleLogin}
            >
              <Typography sx={{ color: primary }}>
                Already have an account? Login here!
              </Typography>
            </Button>
          </Grid>
        </Grid>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}
      </Box>
    </GenericDialog>
  );
}
