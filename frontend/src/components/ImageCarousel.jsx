import React from 'react';
import Carousel from 'react-material-ui-carousel'
import ImageCard from './ImageCard';

function ImageCarousel ({ images }) {
  if (images.length === 0) {
    return null
  }
  return (
        <Carousel
        navButtonsAlwaysVisible
        fullHeightHover={false}
        navButtonsWrapperProps={{
          style: {
            bottom: '-20px',
            top: 'unset'
          }
        }}
        indicatorIconButtonProps={{
          style: {
            padding: '10px', // 1
          }
        }}
        indicatorContainerProps={{
          style: {
            marginTop: '20px', // 5
          }
        }}
        >
            {
                images.map((image, i) => <ImageCard key={i} image={image} />)
            }
        </Carousel>
  )
}

export default ImageCarousel
