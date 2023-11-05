import React from 'react';
import { Typography, Grid, Rating, Box } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';

export default function ListingCard ({ listing, children }) {
  return (
    <React.Fragment>
      <Typography gutterBottom variant="h5" component="div">
        {listing.title}
      </Typography>
      <Typography gutterBottom variant="h6" component="div">
        Type: {listing.metadata.type}
      </Typography>
      <Grid container spacing={{ xs: 1 }} justifyContent="space-between">
        <Grid item xs={2}>
          <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            {listing.numberOfBedrooms} <BedIcon sx={{ ml: 1 }}/>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            {listing.metadata.bathrooms} <BathtubIcon sx={{ ml: 1 }}/>
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h6" component="div" align='right'>
            {listing.price} AUD/Night
          </Typography>
        </Grid>
      </Grid>
      <Typography gutterBottom variant="h6" component="div">
        Address: {listing.address}
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'space-between' }}>
        <Box>
            <Typography component="legend">Average Rating</Typography>
            <Rating name="simple-controlled" value={listing.averageRating !== null ? Number(listing.averageRating) : null } readOnly/>
        </Box>
        <Typography gutterBottom variant="h6" component="div" align='left'>
          {listing.reviews.length > 0 ? listing.reviews.length : 'No' } Reviews
        </Typography>
      </Box>
  </React.Fragment>
  )
}