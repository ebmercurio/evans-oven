/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box, Button, Grid, IconButton, Snackbar, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dispatch, SetStateAction, useState, useEffect,
} from 'react';
import {
  blackText,
  cancelColor, primary, straightFont, whiteBackground,
} from '../../../Constants';
import GenericDialog from '../../GenericDialog';
import { useAuth } from '../../../contexts/AuthContext';

interface ILoginProps {
  showLogin: boolean;
  setShowLogin: Dispatch<SetStateAction<boolean>>;
  setShowSignup: Dispatch<SetStateAction<boolean>>;
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
  triggerFavMessage: boolean;
  setTriggerFavMessage: Dispatch<SetStateAction<boolean>>;
  triggerCommentMessage: boolean;
  setTriggerCommentMessage: Dispatch<SetStateAction<boolean>>;
}

export default function LoginModal(props: ILoginProps) {
  const {
    showLogin,
    setShowLogin,
    setShowSignup,
    setShowForgotPassword,
    triggerFavMessage,
    setTriggerFavMessage,
    triggerCommentMessage,
    setTriggerCommentMessage,
  } = props;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  useEffect(() => {
    if (showLogin) {
      setError(''); // Reset error message when the modal is opened
    }

    if (triggerFavMessage) {
      const timer = setTimeout(() => {
        setTriggerFavMessage(false);
      }, 3000);

      clearTimeout(timer);
    }

    if (triggerCommentMessage) {
      const timer = setTimeout(() => {
        setTriggerCommentMessage(false);
      }, 3000);

      clearTimeout(timer);
    }
  }, [showLogin, triggerFavMessage]);

  const handleForgotPassword = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <GenericDialog
      open={showLogin}
      closeModal={closeModal}
      isLoading={loading}
    >
      <Box
        component="form"
        sx={{ padding: 2, maxWidth: 400, backgroundColor: whiteBackground }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >

        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontFamily: straightFont, fontWeight: 'bold' }}>
              Login
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
              type="submit"
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
              Login
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={handleSignup}
              sx={{ mr: 2 }}
            >
              <Typography sx={{ color: primary }}>
                New? Sign up here!
              </Typography>
            </Button>
            <Box component="span" sx={{ mx: 2, borderLeft: '1px solid #ccc', height: '24px' }} />
            <Button
              variant="text"
              onClick={handleForgotPassword}
            >
              <Typography sx={{ color: primary }}>
                Forgot Password?
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
        {triggerFavMessage && (
          <Snackbar
            open={triggerFavMessage}
            autoHideDuration={3000}
            onClose={() => setTriggerFavMessage(false)}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setTriggerFavMessage(false)}
              >
                <CloseIcon />
              </IconButton>
                )}
          >
            <Alert onClose={() => setTriggerFavMessage(false)} severity="error">
              You must be logged in to favorite a recipe!
            </Alert>
          </Snackbar>
        )}
        {triggerCommentMessage && (
          <Snackbar
            open={triggerCommentMessage}
            autoHideDuration={3000}
            onClose={() => setTriggerCommentMessage(false)}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setTriggerCommentMessage(false)}
              >
                <CloseIcon />
              </IconButton>
                  )}
          >
            <Alert onClose={() => setTriggerCommentMessage(false)} severity="error">
              You must be logged in to comment on a recipe!
            </Alert>
          </Snackbar>
        )}
      </Box>
    </GenericDialog>
  );
}
