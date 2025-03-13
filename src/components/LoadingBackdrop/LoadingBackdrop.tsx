import { Backdrop, CircularProgress } from '@mui/material';
import { loadingBackdropColor } from '../../Constants';

export default function LoadingBackdrop(props: { show: boolean }) {
  const { show } = props;

  return (
    <div data-testid="loading-indicator">
      <Backdrop
        sx={{ color: loadingBackdropColor, zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={show}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
