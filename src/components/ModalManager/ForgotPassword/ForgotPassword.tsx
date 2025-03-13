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

interface IForgotPasswordProps {
  showForgotPassword: boolean;
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
  setShowSignup: Dispatch<SetStateAction<boolean>>;
  setShowLogin: Dispatch<SetStateAction<boolean>>;
}

export default function ForgotPassword(props: IForgotPasswordProps) {
  const {
    showForgotPassword, setShowForgotPassword, setShowSignup, setShowLogin,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (showForgotPassword) {
      setError(''); // Reset error message when the modal is opened
      setMessage(''); // Reset success message when the modal is opened
    }
  }, [showForgotPassword]);

  const closeModal = () => {
    setShowForgotPassword(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignup = () => {
    closeModal();
    setShowSignup(true);
  };

  const handleLogin = () => {
    closeModal();
    setShowLogin(true);
  };

  return (
    <GenericDialog
      open={showForgotPassword}
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
            <Typography
              fontFamily={straightFont}
              fontWeight="bold"
              color={blackText}
            >
              Forgot Password
            </Typography>
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
                color: primary,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: primary, // Border color on initial state
                  },
                  '&:hover fieldset': {
                    borderColor: primary, // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primary, // Border color when focused
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
              color="error"
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
              color="primary"
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
              Send Reset Link
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={handleSignup}
              sx={{ mr: 1 }}
            >
              <Typography sx={{ color: primary }}>
                New? Sign up here!
              </Typography>
            </Button>
            <Box component="span" sx={{ mx: 2, borderLeft: '1px solid #ccc', height: '24px' }} />
            <Button
              variant="text"
              onClick={handleLogin}
            >
              <Typography sx={{ color: primary }}>
                Back to Login
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
        {message && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">
              {message}
            </Alert>
          </Box>
        )}
      </Box>
    </GenericDialog>
  );
}
