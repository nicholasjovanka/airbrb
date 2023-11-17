import React from 'react';
import { render, screen } from '@testing-library/react'
import MediaCard from '../components/MediaCard';

// Test Case for the MediaCard component
describe('MediaCard', () => {
  // Test case of rendering an image on the media card where it is used as a thumbnail
  it('Render the the MediaCard where the content is an image and its being used to display the thumbnail image of a listing', async () => {
    render(<MediaCard type='image' src='https://dummyimage.com/600x400/000/fff.png'/>);

    // Checks if the image component appears
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    // Check if the image source is correct
    expect(img).toHaveAttribute('src', 'https://dummyimage.com/600x400/000/fff.png');

    // Check if the image source is correct
    expect(img).toHaveAttribute('src', 'https://dummyimage.com/600x400/000/fff.png');

    // Check if the image title is correct
    expect(img).toHaveAttribute('title', 'Thumbnail');
  });

  // Test case of using the MediaCard inside the carousel
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    render(<MediaCard type='image' src='https://dummyimage.com/600x400/000/fff.png' usedInCarousel={true} index={1}/>);
    // Checks if the image component appears
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();

    // Check if the image source is correct
    expect(img).toHaveAttribute('src', 'https://dummyimage.com/600x400/000/fff.png');
    expect(img).toHaveAttribute('title', 'Carousel Listing Image 1');
  });

  // Test case of rendering video on the media card
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    render(<MediaCard type='video' src='https://www.youtube.com/watch?v=q6EoRBvdVPQ'/>);

    // Checks if the iframe component appear
    const iframe = screen.getByTitle(/Youtube Video/i);
    expect(iframe).toBeInTheDocument();
    // Check if the video source is correct where the component should convert the youtube link to its embedded form
    const youTubeLinkEmbeddedForm = 'https://www.youtube.com/embed/q6EoRBvdVPQ'
    expect(iframe).toHaveAttribute('src', youTubeLinkEmbeddedForm);
  });

  // Test case where the src that is passed is the prop is empty or null
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    render(<MediaCard type='image' src=''/>);
    const image = screen.queryByRole('img');
    expect(image).toBeNull();
  });
})
