import { Breakpoint, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingBackdrop from '../LoadingBackdrop';

interface GenericModalProps {
  open: boolean;
  closeModal: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: Breakpoint | false;
}

const defaultProps = {
  fullWidth: false,
  maxWidth: false,
};

export default function GenericDialog(props: GenericModalProps) {
  const {
    closeModal, open, children, isLoading, fullWidth, maxWidth,
  } = props;

  return (
    <Dialog open={open} onClose={closeModal} fullWidth={fullWidth} maxWidth={maxWidth}>
      <IconButton
        size="small"
        sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
        onClick={closeModal}
      >
        <CloseIcon />
      </IconButton>
      <LoadingBackdrop show={isLoading} />
      {children}
    </Dialog>
  );
}

GenericDialog.defaultProps = defaultProps;
