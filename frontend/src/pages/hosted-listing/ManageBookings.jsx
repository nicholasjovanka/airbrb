import React, { useEffect, useState, useContext } from 'react';
import { apiCall, getLuxonDayDifference, addDurationAndDateToBookingArray } from '../../utils/utils';
import { Typography, Container, Box } from '@mui/material';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import BookingPagination from '../../components/BookingPagination';
import { StoreContext } from '../../utils/states';

/*
Manage Booking Component that represents the Manage Booking website where a listing owner can see and manage
the booking request of one of their hosted listing specified by the id url query param
*/
const ManageBookings = () => {
  const [listingDetail, setListingDetail] = useState({});
  const [bookings, setBookings] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const { id } = useParams();
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);

  /*
  useEffect that get the Listing details of the listing specified by the id url query param,
  afterwards it will get all the bookings tied to the specified listing.
  */
  useEffect(() => {
    const getListingDetail = async () => {
      try {
        const listingApi = await apiCall(`listings/${id}`, 'GET');
        let listingObject = listingApi.data.listing;
        const currentTime = DateTime.now();
        if (listingObject.postedOn) { // Get how long the listing have been live
          const onlineDuration = currentTime.diff(DateTime.fromISO(listingObject.postedOn), ['years', 'months', 'days', 'hours']).toObject();
          listingObject = { ...listingObject, onlineDuration }
        }
        const bookingsApi = await apiCall('bookings', 'GET');
        let currentListingBookings = bookingsApi.data.bookings.filter((booking) => booking.listingId === id); // Get all bookings tied to the current listing
        currentListingBookings = addDurationAndDateToBookingArray(currentListingBookings); // Add the Duration and string representation of the booking date to each of the bookings
        setBookings(currentListingBookings.reverse());
        // Get the amount of day the listing was booked along with its profit this year which will be displayed by the component
        const [amountOfDayBooked, amountOfProfit] = getAmountOfDayBookedAndProfitThisYear(currentListingBookings);
        listingObject = { ...listingObject, profit: amountOfProfit, daysBooked: amountOfDayBooked }
        setListingDetail(listingObject);
        setInitialLoad(false);
      } catch (error) {
        modalHeader[1]('Error');
        modalMessage[1](error.message);
        openModal[1](true);
      }
    }
    getListingDetail();
  }, []);

  /*
  useEffect that will update the listing object when the bookings array is modified by the BookingPagination component as the user may approve
  a booking which may update the total revenue made by the current listing. Additionaly, ensure that the useEffect only gets triggered by changes made by the
  BookingPagination component instead of the setBookings code in line 37 to prevent the onlineDuration object from disappearing due to the state update behaviour
  as currently the bookings state object is used in the dependency array.
  */
  useEffect(() => {
    if (!initialLoad) {
      const [amountOfDayBooked, amountOfProfit] = getAmountOfDayBookedAndProfitThisYear(bookings);
      const updatedlistingObject = { ...listingDetail, profit: amountOfProfit, daysBooked: amountOfDayBooked }
      setListingDetail(updatedlistingObject);
    }
  }, [bookings]);

  /*
  Function to get the amount of day a listing is booked along with its profit in the current year
  */
  const getAmountOfDayBookedAndProfitThisYear = (bookingArray) => {
    const currentYear = DateTime.now().startOf('day').toObject().year;
    const bookingsThisYear = bookingArray.filter((booking) => DateTime.fromSQL(booking.dateRange.startDate).toObject().year === currentYear && booking.status === 'accepted');
    let amountOfDayBooked = 0;
    let amountOfProfit = 0;
    for (let i = 0; i < bookingsThisYear.length; i++) {
      amountOfProfit += bookingsThisYear[i].totalPrice;
      const startDate = DateTime.fromISO(bookingsThisYear[i].dateRange.startDate);
      let endDate = DateTime.fromISO(bookingsThisYear[i].dateRange.endDate);
      const endDateYear = endDate.toObject().year;
      if (endDateYear !== currentYear) {
        endDate = startDate.endOf('year').startOf('day');
      }
      const dayDifference = getLuxonDayDifference(startDate, endDate);
      amountOfDayBooked += dayDifference;
    }
    return [amountOfDayBooked, amountOfProfit]
  }

  return (
    <Container maxWidth ='md'>
      <Box sx = {{ boxShadow: 3, my: 1, px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h4' gutterBottom sx = {{ mt: 1 }}>
          Booking Information for {listingDetail.title}
        </Typography>
        <Typography variant='h5' gutterBottom sx = {{ mt: 1 }}>
          Listing Statistics
        </Typography>
        <Typography variant='h6' gutterBottom sx = {{ mt: 1 }}>
          {listingDetail.onlineDuration != null ? `Listing Has Been Up For ${Math.floor(listingDetail.onlineDuration.years)} year, ${Math.floor(listingDetail.onlineDuration.months)} month,  ${Math.floor(listingDetail.onlineDuration.days)} days , ${Math.floor(listingDetail.onlineDuration.hours)} hour` : 'Listing is currently offline '}
        </Typography>
        <Typography variant='h6' gutterBottom sx = {{ mt: 1 }}>
          {`Has been booked for ${listingDetail.daysBooked} days this year`}
        </Typography>
        <Typography variant='h6' gutterBottom sx = {{ mt: 1, mb: 5 }}>
          {`Has made ${listingDetail.profit} AUD this year`}
        </Typography>
        <Typography variant='h5' gutterBottom sx = {{ mt: 1 }}>
          Manage Bookings
        </Typography>
        <BookingPagination bookingArray={bookings} setBookingArray={setBookings} viewMode={false} />
      </Box>
  </Container>
  )
}

export default ManageBookings;
