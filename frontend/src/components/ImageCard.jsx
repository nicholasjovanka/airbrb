
import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

function ImageCard ({ key, image, sx = {} }) {
  if (image === '') {
    return null
  }
  return (
      <Card key={key} sx={{ maxWidth: 345, mx: 'auto', ...sx }}>
        <CardMedia
          sx={{ height: 250 }}
          image= {image}
          component='img'
        />
      </Card>
  );
}

export default ImageCard;
