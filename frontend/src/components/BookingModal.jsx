import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';

const BookingModal = ({ open, setOpen, bookFunction, availableDates = [] }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [bookDate, setBookDate] = useState({})
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const handleDateSelectInput = (event) => {
    setSelectedDateRange(event.target.value);
    console.log(event.target.value.split('/')[0].trim());
    const newMinDate = DateTime.fromSQL(event.target.value.split('/')[0].trim());
    const newMaxDate = DateTime.fromSQL(event.target.value.split('/')[1].trim());
    setMinDate(newMinDate);
    setMaxDate(newMaxDate);
    setBookDate({
      startDate: newMinDate,
      endDate: newMaxDate
    })
  }

  useEffect(() => {
    setSelectedDateRange(`${availableDates[0].startDate}/${availableDates[0].endDate}`)
    setMinDate(DateTime.fromSQL(availableDates[0].startDate).startOf('day'));
    setMaxDate(DateTime.fromSQL(availableDates[0].endDate).startOf('day'))
    setBookDate({
      startDate: DateTime.fromSQL(availableDates[0].startDate).startOf('day'),
      endDate: DateTime.fromSQL(availableDates[0].endDate).startOf('day')
    })
  }, [availableDates])

  const handleDatesInput = (newValue, fieldname) => {
    setBookDate({ ...bookDate, [fieldname]: newValue });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby ='booking-dialog-title' maxWidth = 'sm' fullWidth scroll = 'paper' >
        <DialogTitle id='booking-dialog-title'> Make a Booking </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }} id='label-for-available-date-range'>
            1. Pick one of the available date range
          </DialogContentText>
          <Select labelId='label-for-available-date-range' name='availableDateRange' id='select-rating-sort-order' label="Age" value={selectedDateRange} onChange={handleDateSelectInput} sx={{ width: 1 }} >
            { availableDates.map((obj, index) => (
              <MenuItem key={index} value={`${obj.startDate}/${obj.endDate}`}>{`${obj.startDate} - ${obj.endDate}`}</MenuItem>
            )) }
          </Select>
          <DialogContentText sx={{ my: 2 }}>
            2. Pick your date
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: 2, justifyContent: 'center' }}>
              <Box>
                <Typography id={'label-for-start-date'}>
                  Booking Start Date
                </Typography>
                <DatePicker aria-labelledby={'label-for-start-date'} minDate={minDate} maxDate={maxDate} value={bookDate.startDate} onChange={(newValue) => { handleDatesInput(newValue, 'startDate') }} disableHighlightToday/>
                <Typography id={'label-for-end-date'}>
                  Booking End Date
                </Typography>
                <DatePicker aria-labelledby={'label-for-end-date'} minDate={minDate} maxDate={maxDate} value={bookDate.endDate} onChange={(newValue) => { handleDatesInput(newValue, 'endDate') }} disableHighlightToday/>
              </Box>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => bookFunction(bookDate) }>Book Now</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default BookingModal;
