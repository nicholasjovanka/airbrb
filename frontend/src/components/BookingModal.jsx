import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getLuxonDayDifference, isoDateToDDMMYYYY } from '../utils/utils';
import { BootstrapDialog } from '../utils/styles';
import ModalCloseButton from './ModalCloseButton';

const BookingModal = ({ open, setOpen, bookFunction, availableDates = [], price }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [bookDate, setBookDate] = useState({})
  const [estimatedPrice, setEstimatedPrice] = useState(0);

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

  const handleDatesInput = (newValue, fieldname) => {
    const newDateObj = { ...bookDate, [fieldname]: newValue }
    setBookDate(newDateObj);
    setEstimatedPrice(getLuxonDayDifference(newDateObj.startDate, newDateObj.endDate) * price)
  };

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
