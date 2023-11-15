import React, { useEffect, useState, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography, Grid, Container, Tooltip, Button, Rating, Select, MenuItem, InputLabel, TextField } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { apiCall, getLuxonDayDifference, addDurationAndDateToBookingArray, addAverageRatingAndNumberOfBedroomsToListing } from '../../utils/utils';
import { DateTime } from 'luxon';
import { StoreContext } from '../../utils/states';
import ImageCard from '../../components/ImageCard';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BedIcon from '@mui/icons-material/Bed';
import BookingPagination from '../../components/BookingPagination';
import BookingModal from '../../components/BookingModal';
import ImageCarousel from '../../components/ImageCarousel';
import RatingPagination from '../../components/RatingPagination';

const Listing = () => {
  const { id } = useParams();
  const { loggedIn, openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(-1);
  const [duration, setDuration] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [userReview, setUserReview] = useState({
    comment: '',
    rating: null
  })
  const [reviews, setReviews] = useState([]);
  const [originalReviews, setOriginalReviews] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        openBackdrop[1](true);
        const listingsApi = await apiCall(`listings/${id}`, 'GET');
        setListing(addAverageRatingAndNumberOfBedroomsToListing(listingsApi.data.listing)); // Make sure to access the 'listing' property here
        const queryStringStartDate = searchParams.get('startDate');
        const queryStringEndDate = searchParams.get('endDate');
        if (queryStringStartDate && queryStringEndDate) {
          console.log(queryStringStartDate);
          console.log(queryStringEndDate)
          console.log(DateTime.fromSQL(queryStringEndDate).diff(DateTime.fromSQL(queryStringStartDate), ['days']).toObject().days);
          setDuration(getLuxonDayDifference(DateTime.fromSQL(queryStringStartDate), DateTime.fromSQL(queryStringEndDate)));
        }
        await getUserListingBookings();
        setOriginalReviews(listingsApi.data.listing.reviews);
      } catch (error) {
        modalHeader[1]('Error');
        const errorMessage = error.response ? error.response.data.error : error.message;
        modalMessage[1](errorMessage);
        openModal[1](true);
      } finally {
        openBackdrop[1](false);
      }
    }
    fetchListingData();
  }, [loggedIn[0]]);

  const getUserListingBookings = async () => {
    if (loggedIn[0]) {
      const userEmail = localStorage.getItem('userEmail');
      setCurrentUser(userEmail)
      const bookings = await apiCall('bookings', 'GET');
      let bookingTiedToUser = bookings.data.bookings.filter((booking) => booking.owner === userEmail && booking.listingId === id);
      bookingTiedToUser = addDurationAndDateToBookingArray(bookingTiedToUser);
      setBookings(bookingTiedToUser.reverse());
    }
  }

  const filterReviews = () => {
    if (ratingFilter === -1) {
      setReviews(originalReviews);
    } else {
      const filteredReviews = originalReviews.filter((review) => review.rating === ratingFilter);
      setReviews(filteredReviews);
    }
  }

  useEffect(() => {
    filterReviews();
  }, [originalReviews])

  useEffect(() => {
    filterReviews();
  }, [ratingFilter])
  const openBooking = () => {
    setOpenBookingModal(true);
  }

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const postReview = async () => {
    try {
      openBackdrop[1](true);
      if (userReview.rating === null) {
        throw new Error('Please give a rating score')
      }
      const newReview = {
        user: currentUser,
        comment: userReview.comment,
        rating: userReview.rating,
        postedOn: DateTime.now().startOf('day').toISODate()
      }
      const bookingId = bookings.filter((booking) => booking.status === 'accepted')[0].id;
      await apiCall(`listings/${id}/review/${bookingId}`, 'PUT', { review: newReview });
      const reviewArrayCopy = [newReview, ...originalReviews];
      setOriginalReviews(reviewArrayCopy);
      setUserReview({
        comment: '',
        rating: null
      })
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Added a New Review');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    } finally {
      openBackdrop[1](false);
    }
  };

  const submitBookingFunction = async (bookingObj) => {
    try {
      openBackdrop[1](true);
      const startDate = bookingObj.startDate;
      const endDate = bookingObj.endDate;
      const minDate = bookingObj.minDate;
      const maxDate = bookingObj.maxDate;
      const dayDifference = getLuxonDayDifference(startDate, endDate);
      if (dayDifference <= 0) {
        throw new Error('Booking Start Date must be less than Booking End date')
      }
      if (getLuxonDayDifference(minDate, startDate) < 0) {
        throw new Error('Booking Start Date is less then the start date of the currently selected available date range');
      }
      if (getLuxonDayDifference(maxDate, startDate) > 0) {
        throw new Error('Booking Start Date exceeds the end date of the currently selected available date range');
      }
      if (getLuxonDayDifference(minDate, endDate) < 0) {
        throw new Error('Booking End Date is less then the start date of the currently selected available date range');
      }
      if (getLuxonDayDifference(maxDate, endDate) > 0) {
        throw new Error('Booking End Date is exceeds the end date of the currently selected available date range');
      }
      const totalPrice = dayDifference * listing.price;
      const requestBody = {
        dateRange: {
          startDate: startDate.toISODate(),
          endDate: endDate.toISODate()
        },
        totalPrice
      }
      await apiCall(`bookings/new/${id}`, 'POST', requestBody)
      await getUserListingBookings();
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Created a booking for this listing');
      setOpenBookingModal(false);
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    } finally {
      openBackdrop[1](false);
    }
  }
  if (listing === null) {
    return null;
  }
  return (
    <React.Fragment>
      <Container maxWidth ='md'>
        <Grid container spacing={3} sx={{ justifyContent: 'center', px: 2, boxShadow: 3, my: 1, py: 1 }}>
          <Grid item xs={12}>
            <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }} >{listing.title}</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ height: '100%', my: 'auto' }}>
            <ImageCard type='image' src={ listing.thumbnail } sx={{ mb: 2 }} />
            { listing.metadata.url !== '' && (
              <ImageCard type= 'video' src={ listing.metadata.url}/>
            )}
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            <Typography variant='h6'>Street: {listing.address.street}</Typography>
            <Typography variant='h6'>City: {listing.address.city}</Typography>
            <Typography variant='h6'>State: {listing.address.state}</Typography>
            <Typography variant='h6'>Postcode: {listing.address.postcode}</Typography>
            <Typography variant='h6'>Country: {listing.address.country}</Typography>
            <Typography variant='h6'>{duration !== null ? `Only $${duration * listing.price} AUD per stay ` : `Only $${listing.price} AUD per night`}</Typography>
            <Box>
              <Typography variant='h6'>Average Rating:</Typography>
              <Rating name="read-only" value={listing.averageRating ? Number(listing.averageRating) : null} readOnly />
            </Box>
            <Typography variant='h6'>Type: {listing.metadata.type}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
              <Tooltip title='Number of Bathrooms'>
                <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  {listing.metadata.bathrooms} <BathtubIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Bathrooms</Box>
                </Typography>
              </Tooltip>
              <Tooltip title='Number of Bedrooms'>
                <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  {listing.metadata.bedrooms.length} <BedroomParentIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Bedrooms</Box>
                </Typography>
              </Tooltip>
              <Tooltip title='Number of Beds'>
                <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {listing.numberOfBedrooms} <BedIcon sx={{ ml: 1 }}/> <Box component="span" sx={visuallyHidden}>Number of Beds</Box>
                </Typography>
              </Tooltip>
            </Box>
            <Typography variant='h6'> { listing.metadata.amenities.length === 0 ? 'No Amenities' : 'Amenities :'} </Typography>
            {/* Amenities */}
            {listing.metadata.amenities.length > 0 && listing.metadata.amenities.map((amenity, index) => (
              <Typography key={index} variant='body1'>- {amenity}</Typography>))
            }
          </Grid>
          <Grid item xs={12} sx={{ my: 3 }}>
            <Typography variant='h6'> Listing Images </Typography>
            <ImageCarousel images={listing.metadata.files}/>
          </Grid>
          <Grid item xs={12} sx={{ m: 2, p: 2 }}>
            <Typography variant='h5' gutterBottom sx={{ textAlign: 'left' }} >Bookings</Typography>
            {!loggedIn[0] && <Typography variant='subtitle1' gutterBottom sx={{ textAlign: 'left' }} >Please Login to Make a Booking</Typography>}
            <Button sx={{ my: 3 }} variant='contained' disabled={!(loggedIn[0] && listing.owner !== currentUser && listing.availability.length > 0)} onClick={ openBooking }>
              Make a New Booking
            </Button>
            {loggedIn[0] && (<BookingPagination bookingArray={bookings} viewMode={true}/>)}
          </Grid>
          <Grid item xs={12} sx={{ m: 2, p: 2 }}>
            <Typography variant='h5' gutterBottom sx={{ textAlign: 'left', mx: 1, my: 2 }} >Reviews</Typography>
            { bookings.filter((booking) => booking.status === 'accepted').length > 0 && (
              <Box sx={{ border: 1, p: 3, mb: 3 }}>
                 <Typography variant='h6' gutterBottom sx={{ textAlign: 'left' }} >Make a Review</Typography>
                 <Rating
                  name="userRatingValue"
                  value={userReview.rating}
                  onChange={(event, newValue) => {
                    setUserReview({ ...userReview, rating: Number(newValue) })
                  }}
                />
                 <TextField
                  id='user-review'
                  name='userReview'
                  label='Comments'
                  fullWidth
                  variant='outlined'
                  value={userReview.comment}
                  placeholder='Please enter comments about your experience with this listing'
                  onChange={(event) => { setUserReview({ ...userReview, comment: event.target.value }) }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button sx={{ my: 3 }} variant='contained' onClick={postReview}>
                    Post Review
                  </Button>
                </Box>
              </Box>
            )}
            <InputLabel id='label-for-rating-sort-select' sx={{ mb: 2 }} >Filter By Rating </InputLabel>
            <Select
              labelId='label-for-review-rating-filter'
              name='ratingStatus'
              id='select-review-rating-filter'
              label="Filter By rating"
              value={ratingFilter}
              onChange={handleRatingFilterChange}
              sx={{ width: 1, maxWidth: 'sm', mb: 2 }}
              >
              <MenuItem value={-1}>Any Star</MenuItem>
              <MenuItem value={5}>5 Star</MenuItem>
              <MenuItem value={4}>4 Star</MenuItem>
              <MenuItem value={3}>3 Star</MenuItem>
              <MenuItem value={2}>2 Star</MenuItem>
              <MenuItem value={1}>1 Star</MenuItem>
            </Select>
            <RatingPagination ratingArray={reviews}></RatingPagination>
          </Grid>
        </Grid>
      </Container>
      {listing.availability.length > 0 && (<BookingModal open={openBookingModal} setOpen={setOpenBookingModal} availableDates={listing.availability} bookFunction={submitBookingFunction} price={listing.price}/>)}
    </React.Fragment>
  );
};

export default Listing;
