import React, { useState, useEffect } from 'react';
import { Rating, Box, Tooltip, tooltipClasses, styled, Typography, LinearProgress, linearProgressClasses, Link } from '@mui/material';
// Custom Styling for Material UI Tooltip component
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    width: 300,
    maxWidth: 400
  },
});

// Custom Styling for Material UI BorderLinearProgress Component
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#FFF6E0',
    border: '1px solid'
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: '#FFA41C'
  },
}));

/*
Component that shows a Tooltip which contains the Overall Rating and the amount of rating for each rating category of a specific listing

Props Explanation;
- passedListing: The listing object that contains the reviews that want to be shown by the component
- openRatingModalFunction: Function that is used to open the RatingModal component which is embedded inside this component. Will be received from the LisitngPagination component
*/
const RatingTooltip = ({ passedListing, openRatingModalFunction, children }) => {
  const [listing, setListing] = useState(null);
  const [ratingsSummary, setRatingsSummary] = useState([]);

  /*
  useEffect to detect changes to the passedListing prop which in turn will re-render the rating information displayed by the component,
  */
  useEffect(() => {
    setRatingsSummary([]);
    setListing(passedListing);
  }, [passedListing])

  /*
  useEffect that gets the rating summary for each rating category when the listing state object is updated and the listing object actually contain reviews.
  */
  useEffect(() => {
    if (listing !== null && listing.reviews.length > 0) {
      // Array storing the rating, index 0 will store the amount of rating that has 1 as the rating value, index 1 for rating with value 2 and so on
      let ratingArray = [
        {
          rating: 1,
          amountOfRating: 0,
          percentage: 0
        },
        {
          rating: 2,
          amountOfRating: 0,
          percentage: 0
        },
        {
          rating: 3,
          amountOfRating: 0,
          percentage: 0
        },
        {
          rating: 4,
          amountOfRating: 0,
          percentage: 0
        },
        {
          rating: 5,
          amountOfRating: 0,
          percentage: 0
        }]
      for (let i = 0; i < listing.reviews.length; i++) {
        ratingArray[listing.reviews[i].rating - 1].amountOfRating += 1;
      }
      ratingArray = ratingArray.map((rating) => {
        return {
          ...rating,
          percentage: Math.round((rating.amountOfRating / listing.reviews.length) * 100)
        }
      }
      )
      setRatingsSummary(ratingArray.reverse());
    }
  }, [listing])

  return (
    <CustomWidthTooltip placement='bottom-end' title=
    { ratingsSummary.length > 0
      ? (
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Rating name="simple-controlled" value={listing.averageRating} readOnly/>
          <Typography variant='body1' noWrap > {listing.averageRating} out of 5 </Typography>
        </Box>
        <Typography variant='subtitle1'>{listing.reviews.length} Ratings </Typography>
        {ratingsSummary.map((rating, index) =>
          <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '100%', justifyContent: 'center' }}>
              <Link component="button" variant="subtitle1" onClick={() => openRatingModalFunction(listing.reviews, listing.title, rating.rating)}>
                {rating.rating} Star
              </Link>
              <BorderLinearProgress variant='determinate' sx={{ width: '40%', height: '1rem', my: 'auto' }} value={rating.percentage} />
              <Box>
                <Typography variant='subtitle1' >{rating.percentage}%</Typography>
                <Typography variant='subtitle1' >({rating.amountOfRating} reviews) </Typography>
              </Box>
          </Box>
        )}
      </Box>
        )
      : <Typography>
      No Reviews Found
    </Typography>
    }>
        {children}
    </CustomWidthTooltip>
  )
}

export default RatingTooltip
