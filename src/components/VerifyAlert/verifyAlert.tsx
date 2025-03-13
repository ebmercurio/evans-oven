import { Snackbar, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';

interface IVerifyAlertProps {
  triggerEmailVerifyMessage: boolean;
  setTriggerEmailVerifyMessage: Dispatch<SetStateAction<boolean>>;
}

export default function VerifyAlert(props: IVerifyAlertProps) {
  const { triggerEmailVerifyMessage, setTriggerEmailVerifyMessage } = props;

  return (
    <div>
      {triggerEmailVerifyMessage && (
      <Snackbar
        open={triggerEmailVerifyMessage}
        autoHideDuration={3000}
        onClose={() => setTriggerEmailVerifyMessage(false)}
        action={(
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setTriggerEmailVerifyMessage(false)}
          >
            <CloseIcon />
          </IconButton>
                )}
      >
        <Alert onClose={() => setTriggerEmailVerifyMessage(false)} severity="error">
          You must verify your email before favoriting/commenting
        </Alert>
      </Snackbar>
      )}
    </div>
  );
}
