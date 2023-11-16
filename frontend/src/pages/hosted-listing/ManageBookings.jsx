import React, { useEffect, useState, useContext } from 'react';
import { apiCall, getLuxonDayDifference, addDurationAndDateToBookingArray } from '../../utils/utils';
import { Typography, Container, Box } from '@mui/material';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import BookingPagination from '../../components/BookingPagination';
import { StoreContext } from '../../utils/states';
const ManageBookings = () => {
  const [listingDetail, setListingDetail] = useState({});
  const [bookings, setBookings] = useState([]);
  const [alreadyInitialLoad, setAlreadyInitialLoad] = useState(false);
  const { id } = useParams();
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  useEffect(() => {
    const getListingDetail = async () => {
      try {
        const listingApi = await apiCall(`listings/${id}`, 'GET');
        let listingObject = listingApi.data.listing;
        const currentTime = DateTime.now();
        if (listingObject.postedOn) {
          const onlineDuration = currentTime.diff(DateTime.fromISO(listingObject.postedOn), ['years', 'months', 'days', 'hours']).toObject();
          listingObject = { ...listingObject, onlineDuration }
        }
        const bookingsApi = await apiCall('bookings', 'GET');
        let currentListingBookings = bookingsApi.data.bookings.filter((booking) => booking.listingId === id);
        currentListingBookings = addDurationAndDateToBookingArray(currentListingBookings);
        setBookings(currentListingBookings.reverse());
        const [amountOfDayBooked, amountOfProfit] = getAmountOfDayBookedAndProfit(currentListingBookings);
        listingObject = { ...listingObject, profit: amountOfProfit, daysBooked: amountOfDayBooked }
        setListingDetail(listingObject);
        setAlreadyInitialLoad(true);
      } catch (error) {
        modalHeader[1]('Error');
        modalMessage[1](error.message);
        openModal[1](true);
      }
    }
    getListingDetail();
  }, [])

  useEffect(() => {
    if (alreadyInitialLoad) {
      const [amountOfDayBooked, amountOfProfit] = getAmountOfDayBookedAndProfit(bookings);
      const updatedlistingObject = { ...listingDetail, profit: amountOfProfit, daysBooked: amountOfDayBooked }
      setListingDetail(updatedlistingObject);
    }
  }, [bookings])

  const getAmountOfDayBookedAndProfit = (bookingArray) => {
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
