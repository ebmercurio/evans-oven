import { useEffect, useState } from 'react';
import {
  Container, TableContainer, Table, TableHead, TableRow, TableCell, Typography,
  TextField, Button, Paper, TableBody, Avatar, Grid, Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../../../contexts/AuthContext';
import IUserData from '../../../interfaces/IUserData';
import { auth } from '../../../firebase';
import { cancelColor, primary } from '../../../Constants';

export default function UserProfileView() {
  const { currentUser, firebaseUser, setCurrentUser } = useAuth();
  const [initialUserData] = useState<IUserData>({
    photo: currentUser?.photoURL || '',
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [userData, setUserData] = useState<IUserData>({ ...initialUserData });
  const [editState, setEditState] = useState({
    photoEdit: false,
    nameEdit: false,
    emailEdit: false,
    passwordEdit: false,
    confirmPasswordEdit: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const user = auth.currentUser;
  const emailLinkMessage = 'Verification email sent.';

  type UserDataField = keyof IUserData;

  const handleInputChange = (field: UserDataField) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserData({ ...userData, [field]: event.target.value });
  };

  const handleSendEmailLink = async () => {
    if (user) {
      await sendEmailVerification(user);
      setShowEmailAlert(true);
    }
  };

  const isFieldEmpty = (field: UserDataField) => userData[field].trim() === '';

  type EditStateField = keyof typeof editState;

  const handleEditToggle = (field: EditStateField) => {
    if (editState[field]) {
      // Reset userData to initial values when canceling edit
      setUserData({ ...userData });
    }
    setEditState({ ...editState, [field]: !editState[field] });
  };

  const resetEdits = () => {
    setEditState({
      photoEdit: false,
      nameEdit: false,
      emailEdit: false,
      passwordEdit: false,
      confirmPasswordEdit: false,
    });
    setUserData({ ...userData, password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (firebaseUser) {
      try {
        if (editState.emailEdit
          && userData.email
          && userData.email !== currentUser?.email
          && userData.email.length > 0) {
          await updateEmail(firebaseUser, userData.email);
        } else if (editState.nameEdit
          && userData.name
          && userData.name !== currentUser?.displayName
          && userData.name.length > 0) {
          try {
            await updateProfile(firebaseUser, { displayName: userData.name });
          } catch (er: unknown) {
            if (er instanceof Error) {
              setError(`Failed to update profile: ${er.message}`);
            } else {
              setError('Failed to update profile');
            }
          }
        } else if (editState.photoEdit
          && userData.photo !== currentUser?.photoURL
        ) {
          await updateProfile(firebaseUser, { photoURL: userData.photo });
          setCurrentUser({
            ...currentUser,
            photoURL: userData.photo, // Only update the photoURL field
            uid: currentUser?.uid ?? '',
            favorites: currentUser?.favorites ?? [],
            displayName: currentUser?.displayName ?? '',
          });
        } else {
          setError('Failed to update profile: ');
          setLoading(false);
          return;
        }
        resetEdits();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to update profile: ${err}`);
        } else {
          setError('Failed to update profile');
        }
      }
    }
    setLoading(false);
  };

  function renderEditableField(label: string, field: UserDataField, isEditing: boolean) {
    return (
      <TableRow>
        <TableCell><Typography>{label}</Typography></TableCell>
        <TableCell colSpan={2}>
          <TextField
            disabled={!isEditing}
            value={userData[field]}
            onChange={handleInputChange(field)}
            error={isFieldEmpty(field) && isEditing}
            helperText={isFieldEmpty(field) && isEditing ? `${label} is required` : ''}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            onClick={() => handleEditToggle(`${field}Edit`)}
            sx={{
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
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </TableCell>
        <TableCell>
          {isEditing && (
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
            Save
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  }

  function renderDisplayNameField(label: string, field: UserDataField, isEditing: boolean) {
    return (
      <TableRow>
        <TableCell><Typography>{label}</Typography></TableCell>
        <TableCell colSpan={4}>
          <TextField
            disabled={!isEditing}
            value={userData[field]}
          />
        </TableCell>
      </TableRow>
    );
  }

  function renderPasswordField() {
    return (
      <TableRow>
        <TableCell><Typography>Password</Typography></TableCell>
        <TableCell colSpan={2}>
          <TextField type="password" label="Password" disabled={!editState.passwordEdit} value={userData.password} onChange={handleInputChange('password')} sx={{ mr: 1 }} />
          <TextField type="password" label="Confirm Password" disabled={!editState.passwordEdit} value={userData.confirmPassword} onChange={handleInputChange('confirmPassword')} />
        </TableCell>
        <TableCell>
          <Button variant="outlined" color="error" onClick={() => handleEditToggle('passwordEdit')}>
            {editState.passwordEdit ? 'Cancel' : 'Edit'}
          </Button>
        </TableCell>
        <TableCell>
          {editState.passwordEdit && <Button variant="contained" color="primary" onClick={() => {}}>Save</Button>}
        </TableCell>
      </TableRow>
    );
  }
  function renderEmailVerifyLink() {
    return (
      <TableRow>
        <TableCell>
          <Button variant="outlined" color="primary" onClick={handleSendEmailLink}>
            <Typography>
              Resend Email Verification
            </Typography>
          </Button>
          {showEmailAlert && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                {emailLinkMessage}
              </Alert>
            </Box>
          )}
        </TableCell>
      </TableRow>
    );
  }

  useEffect(() => {
    if (showEmailAlert) {
      const timer = setTimeout(() => {
        setShowEmailAlert(false);
      }, 3000);

      clearTimeout(timer);
    }
  }, [showEmailAlert]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container sx={{ textAlign: 'center', p: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h4">User Profile</Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={6} sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Basic Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Avatar src={userData.photo} alt="Profile Picture" sx={{ width: 80, height: 80 }} />
                </TableCell>
              </TableRow>
              {renderEditableField('Profile Photo', 'photo', editState.photoEdit)}
              {renderDisplayNameField('Display Name', 'name', editState.nameEdit)}
              {renderEditableField('Email Address', 'email', editState.emailEdit)}
              {renderPasswordField()}
              {!auth.currentUser?.emailVerified && (
                renderEmailVerifyLink()
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="outlined" color="error" onClick={() => {}} sx={{ my: 1, fontWeight: 'bold' }}>Logout</Button>
      </Container>
    </LocalizationProvider>
  );
}
