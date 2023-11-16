import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getLuxonDayDifference, isoDateToDDMMYYYY } from '../utils/utils';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

/*
Modal used to by the Listing Detail Screen so that a User/Customer can make a booking based on the available dates of that listing
Props explanation:
- open: boolean state variable passed from the parent that dictates when to open the booking modal
- setOpen: The state set function for the 'open' boolean state that allows the modal to close when the close button is clicked
- bookFunction: booking function passed from the parent that is passed as a prop which dictates what happens when the user click the book button in the modal
- availableDates: Array of object that describes the available date range of the booking. Each of the object contain a start date and end date which is a string of date in YYYY-mm-dd format
- price: The price for booking the specified listing per day. Used to show the user price estimations
*/
const BookingModal = ({ open, setOpen, bookFunction, availableDates = [], price }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [bookDate, setBookDate] = useState({})
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  /*
  Function that changes the date in the date picker when the user selects a new availability date range
  For Example, Lets say the booking has 2 available date range for booking, if user change from option 1 to 2 then it updates the date picker
  */
  const handleDateSelectInput = (event) => {
    setSelectedDateRange(event.target.value);
    const newMinDate = DateTime.fromSQL(event.target.value.split('/')[0].trim());
    const newMaxDate = DateTime.fromSQL(event.target.value.split('/')[1].trim());
    setBookDate({
      startDate: newMinDate,
      endDate: newMaxDate,
      minDate: newMinDate,
      maxDate: newMaxDate
    })
    setEstimatedPrice(getLuxonDayDifference(newMinDate, newMaxDate) * price)
  }

  /*
  Use Effect Used to Update the Date Picker when the availabilityDates passed from the parent change.
  */
  useEffect(() => {
    setSelectedDateRange(`${availableDates[0].startDate}/${availableDates[0].endDate}`)
    const startDate = DateTime.fromSQL(availableDates[0].startDate).startOf('day')
    const endDate = DateTime.fromSQL(availableDates[0].endDate).startOf('day')
    setBookDate({
      startDate,
      endDate,
      minDate: startDate,
      maxDate: endDate
    })
    setEstimatedPrice(getLuxonDayDifference(startDate, endDate) * price)
  }, [availableDates])

  /*
  Function that changes the bookDate state which tracks the start date and end date that the user pick to book when the DatePicker input change in value
  */
  const handleDatesInput = (newValue, fieldname) => {
    const newDateObj = { ...bookDate, [fieldname]: newValue }
    setBookDate(newDateObj);
    setEstimatedPrice(getLuxonDayDifference(newDateObj.startDate, newDateObj.endDate) * price)
  };

  /*
  Function that allows the close button of the modal to close the modal
  */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog open={open} onClose={handleClose} aria-labelledby ='booking-dialog-title' maxWidth = 'sm' fullWidth scroll = 'paper' >
        <DialogTitle id='booking-dialog-title'> Make a Booking </DialogTitle>
        <ModalCloseButton handleClose={handleClose}/>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: 'black' }} id='label-for-available-date-range'>
            1. Pick one of the available date range
          </DialogContentText>
          <Select labelId='label-for-available-date-range' name='availableDateRange' id='select-rating-sort-order' label="Age" value={selectedDateRange} onChange={handleDateSelectInput} sx={{ width: 1 }} >
            { availableDates.map((obj, index) => (
              <MenuItem key={index} value={`${obj.startDate}/${obj.endDate}`}>{`${isoDateToDDMMYYYY(obj.startDate)} - ${isoDateToDDMMYYYY(obj.endDate)}`}</MenuItem>
            )) }
          </Select>
          <DialogContentText sx={{ my: 2, color: 'black' }}>
            2. Pick your date
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: 2, justifyContent: 'center' }}>
              <Box>
                <Typography id={'label-for-start-date'}>
                  Booking Start Date
                </Typography>
                <DatePicker aria-labelledby={'label-for-start-date'} minDate={bookDate.minDate} maxDate={bookDate.maxDate} value={bookDate.startDate} onChange={(newValue) => { handleDatesInput(newValue, 'startDate') }} disableHighlightToday/>
                <Typography id={'label-for-end-date'}>
                  Booking End Date
                </Typography>
                <DatePicker aria-labelledby={'label-for-end-date'} minDate={bookDate.minDate} maxDate={bookDate.maxDate} value={bookDate.endDate} onChange={(newValue) => { handleDatesInput(newValue, 'endDate') }} disableHighlightToday/>
              </Box>
            </Box>
          </LocalizationProvider>
          <DialogContentText sx={{ my: 2, color: 'black' }}>
            Estimated Price ${estimatedPrice} AUD
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => bookFunction(bookDate) }>Book Now</Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default BookingModal;
