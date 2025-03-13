// components/HomeHero/StyledBigButton.tsx
import React from 'react';
import { Button, Box } from '@mui/material';

interface MediumCategoryCardProps {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  onClick?: () => void;
}

export default function MediumCategoryCard(props: MediumCategoryCardProps) {
  const { children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Button>
  );
}
