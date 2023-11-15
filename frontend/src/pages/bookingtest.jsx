import React, { useState, useContext } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { apiCall, getLuxonDayDifference } from '../utils/utils';
import BookingModal from '../components/BookingModal';
import { DateTime } from 'luxon';
import { StoreContext } from '../utils/states';
import RatingPagination from '../components/RatingPagination';
const BookingTest = () => {
  const [id, setId] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const [listingDetails, setListingDetails] = useState({})
  const [date, setDate] = useState([{ startDate: DateTime.now().toISODate(), endDate: DateTime.now().toISODate() }]);
  const getListingDetail = async () => {
    const listingDetails = await apiCall(`listings/${id}`, 'GET');
    console.log(listingDetails);
    setDate(listingDetails.data.listing.availability);
    setListingDetails(listingDetails.data.listing)
    console.log(listingDetails.data.listing.availability);
    setOpenBookingModal(true)
  }

  const submitBookingFunction = async (bookingObj) => {
    try {
      const currentStartDate = bookingObj.startDate;
      const currentEndDate = bookingObj.endDate;
      const dayDifference = getLuxonDayDifference(currentStartDate, currentEndDate);
      if (dayDifference <= 0) {
        throw new Error('Booking Start Date must be less than Booking End date')
      }
      console.log(dayDifference);
      const totalPrice = dayDifference * listingDetails.price;
      const requestBody = {
        dateRange: {
          startDate: currentStartDate.toISODate(),
          endDate: currentEndDate.toISODate()
        },
        totalPrice
      }
      await apiCall(`bookings/new/${id}`, 'POST', requestBody)
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Created a booking for this listing');
      setOpenBookingModal(false);
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  return (
    <React.Fragment>
      <Box>
        Welcome to Listing
        <TextField id='search-bar-property-name-and-city' name='searchbar' fullWidth type= 'text' variant='standard' value={id} onChange={(event) => setId(event.target.value)} sx={{ maxWidth: 'sm' }}/>
            <Button sx={{ float: 'right' }} variant='contained' onClick={getListingDetail}>
              Search
            </Button>
      </Box>
      <BookingModal open={openBookingModal} setOpen={setOpenBookingModal} availableDates={date} bookFunction={submitBookingFunction} price={50}/>
      <RatingPagination ratingArray={Array(20).fill(1)}></RatingPagination>
    </React.Fragment>
  )
}

export default BookingTest;
