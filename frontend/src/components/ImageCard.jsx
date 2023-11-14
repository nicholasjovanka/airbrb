
import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { getId } from '../utils/utils';

const ImageCard = ({ type = 'image', newKey = null, src, sx = {} }) => {
  if (src === '') {
    return null
  }
  return (
    <Card {...(newKey !== null && { key: newKey })} sx={{ maxWidth: 350, mx: 'auto', ...sx }}>
    <CardMedia
      sx={{ height: 250, maxWidth: 'sm' }}
      component={ type === 'video' ? 'iframe' : 'img'}
      src= {type === 'video' ? `https://www.youtube.com/embed/${getId(src)}` : src}
      title="Thumbnail"
      controls
    />
  </Card>
  )
}

export default ImageCard;
