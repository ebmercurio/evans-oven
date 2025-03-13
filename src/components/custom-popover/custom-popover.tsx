/* eslint-disable @typescript-eslint/no-explicit-any */
import Popover from '@mui/material/Popover';

// ----------------------------------------------------------------------
export default function CustomPopover(
  props: {
    open: any,
    children: any,
    sx: any,
    anchorEl: HTMLButtonElement | null,
    closePopover: () => void,
  },
) {
  // const open = Boolean(anchorEl);
  // const { style } = getPosition('top-right');
  const {
    open, children, sx, anchorEl, closePopover,
  } = props;

  const handleClose = () => {
    closePopover();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose} // This is already present, ensure it is doing the right thing
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{ zIndex: 9999 }}
      slotProps={{
        paper: {
          sx: {
            zIndex: 9999,
            width: 'auto',
            overflow: 'inherit',
            ...sx,
          },
        },
      }}
    >
      {children}
    </Popover>
  );
}
