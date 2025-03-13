import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ErrorMessageInterface } from './ErrorMessageInterface';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: 600,
    maxWidth: 'calc(100% - 32px',
    overflowY: 'auto',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
  },
  '& .MuiDialogTitle-root': {
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '16px 24px',
  },
  '& .MuiDialogActions-root': {
    padding: '16px',
    justifyContent: 'flex-end',
  },
  '& .MuiButton-root': {
    fontSize: '16px',
    padding: '8px 16px',
    marginLeft: '16px',
  },
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  errorResponse: ErrorMessageInterface | undefined;
  customErrorMessage?: string;
}

export default function ErrorDialog(props: DialogProps) {
  const {
    onClose, errorResponse, open, customErrorMessage,
  } = props;
  const [errorMessage, setErrorMessage] = useState('Shit is broke');

  useEffect(() => {
    if (errorResponse) {
      if (errorResponse?.response?.data?.status === 400) {
        const allMessages: string[] = Object.values(errorResponse?.response?.data?.errors).flatMap(
          (value: string[]) => value,
        );
        const allMessagesJoined = `One or more errors occued.\n\n${allMessages.join('\n')}`;
        setErrorMessage(allMessagesJoined);
      } else {
        setErrorMessage('Shit is Broke');
      }
    }
  }, [errorResponse]);

  useEffect(() => {
    if (customErrorMessage?.length && customErrorMessage !== '') {
      setErrorMessage(customErrorMessage);
    }
  }, [customErrorMessage]);

  return (
    <StyledDialog open={open} onClose={onClose} data-testid="error-dialog">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Error
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{errorMessage}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </StyledDialog>
  );
}

ErrorDialog.defaultProps = {
  customErrorMessage: '',
};
