// import { forwardRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// @mui
import { Box, SxProps } from '@mui/material';
//
import getRatio from './getRatio';

// ----------------------------------------------------------------------
interface ImageProps {
  alt: string,
  src: string,
  ratio: string,
  sx: SxProps,
}

export default function Image(props: ImageProps) {
  const {
    ratio, sx, alt, src,
  } = props;

  const content = (
    <Box
      component={LazyLoadImage}
      alt={alt}
      src={src}
      wrapperClassName="wrapper"
      sx={{
        width: 1, height: 1, objectFit: 'cover', ...(sx || {}),
      }}
    />
  );

  if (ratio) {
    return (
      <Box
        component="span"
        sx={{
          width: 1,
          lineHeight: 1,
          display: 'block',
          overflow: 'hidden',
          position: 'relative',
          pt: getRatio(ratio),
          '& .wrapper': {
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            position: 'absolute',
            backgroundSize: 'cover !important',
          },
          ...sx,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        lineHeight: 1,
        display: 'block',
        overflow: 'hidden',
        position: 'relative',
        '& .wrapper': {
          width: 1,
          height: 1,
          backgroundSize: 'cover !important',
        },
        ...sx,
      }}
    >
      {content}
    </Box>
  );
}
