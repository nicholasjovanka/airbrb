import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { apiCall } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

const Listing = () => {
  const { id } = useParams();
  const { loggedIn } = useContext(StoreContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await apiCall(`listings/${id}`, 'GET');
        setListing(response.data.listing); // Make sure to access the "listing" property here
        setLoading(false);
      } catch (error) {
        console.error('Failed to load listing details:', error);
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!listing) {
    return <Typography>Listing not found.</Typography>;
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>{listing.title}</Typography>
      <Typography variant="subtitle1">{listing.address}</Typography>
      {/* Amenities */}
      {listing.metadata && listing.metadata.amenities && (
        <Box>
          <Typography variant="subtitle2">Amenities:</Typography>
          {listing.metadata.amenities.map((amenity, index) => (
            <Typography key={index}>- {amenity}</Typography>
          ))}
        </Box>
      )}
      {/* Price */}
      <Typography variant="h6">Price: ${listing.price} per night</Typography>
      {/* Images */}
      {listing.metadata && listing.metadata.files && (
        <Grid container spacing={2}>
          {listing.metadata.files.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper>
                <img src={image} alt={`Property ${index}`} style={{ width: '100%', height: 'auto' }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Type */}
      <Typography>Type: {listing.metadata.type}</Typography>
      {/* Reviews and Ratings */}
      {listing.reviews && (
        <Box>
          <Typography variant="subtitle2">Reviews:</Typography>
          {listing.reviews.map((review, index) => (
            <Box key={index} my={2}>
              <Typography variant="body2">{review.comment}</Typography>
              <Typography variant="body2">Rating: {review.rating}</Typography>
            </Box>
          ))}
        </Box>
      )}
      {/* Bedrooms, Beds, Bathrooms */}
      {listing.metadata && (
        <>
          <Typography>Bedrooms: {listing.metadata.bedrooms.length}</Typography>
          <Typography>Beds: {listing.metadata.bedrooms.reduce((total, bedroom) => total + bedroom.beds, 0)}</Typography>
          <Typography>Bathrooms: {listing.metadata.bathrooms}</Typography>
        </>
      )}
      {/* Booking status if logged in */}
      {loggedIn[0] && listing.availability && (
        <Box>
          <Typography variant="subtitle2">Your Booking Status:</Typography>
          {listing.availability.map((availability, index) => (
            <Typography key={index}>
              From {availability.startDate} to {availability.endDate}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Listing;
