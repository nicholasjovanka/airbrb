
import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { getId } from '../utils/utils';

/*
Card component used to display images or videos based on the 'type' prop that is set. Used by the Image Carousel and ListingForm Component.
Also used in the Listing Details page.

Props Explanation
- type: prop that tells the component whether it should render a picture or a video. To render a picture pass 'image' as the prop, other wise pass 'video' if you want to render
a video in the component
- src: The source of the image(in this case base64 string) or the URL of the video that want to be displayed inside the component
- sx: Styling prop to add more css to the Card component inside this component
- usedInCarousel: boolean that tells the component if the image card is currently being used by the image carousel
*/
const MediaCard = ({ type = 'image', usedInCarousel = false, src, sx = {}, index = null }) => {
  if (src === '' || src === null) {
    return null
  }
  return (
    <Card sx={{ maxWidth: 350, mx: 'auto', ...sx }}>
      <CardMedia
        sx={{ height: 250, maxWidth: 'sm' }}
        component={ type === 'video' ? 'iframe' : 'img'}
        src= {type === 'video' ? `https://www.youtube.com/embed/${getId(src)}` : src}
        title={type === 'video' ? 'Youtube Video' : usedInCarousel ? `Carousel Listing Image ${index}` : 'Thumbnail'}
        controls
      />
  </Card>
  )
}

export default MediaCard;
