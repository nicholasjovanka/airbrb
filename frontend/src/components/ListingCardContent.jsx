import React from 'react';
import { Typography, Grid, Rating, Box, Link, Tooltip } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import { visuallyHidden } from '@mui/utils';
import RatingTooltip from './RatingTooltip';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';

/*
Component that contains the content that will be displayed inside the Listing Cards in the ListingPagination component

Props Explanation
- listing: The listing object that should be displayed using the component
- displayPage: Text that tells where the page that the component is currently being displayed on as some component need to be rendered differently depending on the page
(For example in hosted listing it should display number of beds instead of bedroom)
- openRatingModalFunction : Function passed from the parent that will display the RatingModal
- navigateToListing: Function passed that dictates the logic required to navigate tp the listing detail page of the current listing that is being displayed in the component
*/
const ListingCardContent = ({ listing, displayPage, openRatingModalFunction, navigateToListing, children }) => {
  return (
    <Box sx={{ mx: 1 }}>
      <Link component="button" variant="h5" onClick={() => navigateToListing()}>
        {listing.title}
      </Link>
      <Typography gutterBottom variant="h6" component="div">
        Type: {listing.metadata.type}
      </Typography>
      <Grid container spacing={{ xs: 1 }} justifyContent="space-between">
        <Grid item xs={2}>
          {
            displayPage === 'hostedlisting'
              ? (
                <Tooltip title='Number of Beds'>
                  <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    {listing.numberOfBeds} <BedIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Beds</Box>
                  </Typography>
                </Tooltip>
                )
              : (
                  <Tooltip title='Number of Bedrooms'>
                    <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      {listing.metadata.bedrooms.length} <BedroomParentIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Bedrooms</Box>
                    </Typography>
                  </Tooltip>
                )
          }
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Number of Bathrooms'>
            <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {listing.metadata.bathrooms} <BathtubIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Bathrooms</Box>
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h6" component="div" align='right'>
            {listing.price} AUD/Night
          </Typography>
        </Grid>
      </Grid>
      <Typography gutterBottom variant="h6" component="div">
        {`${listing.address.street}, ${listing.address.city}, ${listing.address.state}  ${listing.address.postcode}, ${listing.address.country}`}
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'space-between' }}>
        <Box>
            <RatingTooltip passedListing={listing} openRatingModalFunction={openRatingModalFunction}>
              <Box>
                <Typography component="legend">Average Rating</Typography>
                <Rating name="simple-controlled" value={listing.averageRating !== null ? Number(listing.averageRating) : null } readOnly/>
              </Box>
            </RatingTooltip>
        </Box>
        <Typography gutterBottom variant="h6" component="div" align='left'>
          {listing.reviews.length > 0 ? listing.reviews.length : 'No' } Reviews
        </Typography>
      </Box>
  </Box>
  )
}

export default ListingCardContent
