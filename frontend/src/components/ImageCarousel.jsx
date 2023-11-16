import React from 'react';
import Carousel from 'react-material-ui-carousel'
import ImageCard from './ImageCard';

/*
Image Carousel Component used in the ListingForm Component and Listing Detail page which is used to display a carousel that allows the user to browse multiple image

Props Explanation
- images: Array containing the base64 string of the images
*/
const ImageCarousel = ({ images }) => {
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
                images.map((image, i) => <ImageCard key={i} src={image} />)
            }
        </Carousel>
  )
}

export default ImageCarousel
