
import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const ImageCard = ({ newKey, image, sx = {} }) => {
  if (image === '') {
    return null
  }
  if (newKey === null) {
    return (
      <Card sx={{ maxWidth: 350, mx: 'auto', ...sx }}>
      <CardMedia
        sx={{ height: 250 }}
        image= {image}
        component='img'
      />
    </Card>
    )
  } else {
    return (
      <Card key={newKey} sx={{ maxWidth: 350, mx: 'auto', ...sx }}>
        <CardMedia
          sx={{ height: 250 }}
          image= {image}
          component='img'
        />
      </Card>
    );
  }
}

export default ImageCard;
