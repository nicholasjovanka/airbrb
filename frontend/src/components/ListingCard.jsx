import React from 'react';
import { Typography, Grid, Rating, Box, Link } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing, displayPage, children }) => {
  const navigate = useNavigate()
  return (
    <Box sx={{ mx: 1 }}>
      { displayPage === 'home' &&
      <Link component="button" variant="h5" onClick={() => navigate(`/listing/${listing.id}`)}>
        {listing.title}
        </Link>
      }
      { displayPage === 'hostedlisting' &&
        <Typography gutterBottom variant="h5" component="div">
          {listing.title}
        </Typography>
      }

      <Typography gutterBottom variant="h6" component="div">
        Type: {listing.metadata.type}
      </Typography>
      <Grid container spacing={{ xs: 1 }} justifyContent="space-between">
        <Grid item xs={ displayPage === 'hostedlisting' ? 12 : 2}>
          {
            displayPage === 'hostedlisting'
              ? (
                  <Typography gutterBottom variant="h6" component="div" noWrap >
                    {listing.numberOfBedrooms} Beds
                  </Typography>
                )
              : (
                  <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    { listing.metadata.bedrooms.length } <BedIcon sx={{ ml: 1 }}/>
                  </Typography>
                )
          }
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
  </Box>
  )
}

export default ListingCard
