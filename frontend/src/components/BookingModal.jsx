import React, { useState, useContext, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { StoreContext } from '../utils/states';

const BookingModal = ({ open, setOpen, bookFunction, availableDates }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(`${availableDates[0].startDate} - ${availableDates[0].endDate}`);
  const [minDate, setMinDate] = useState(DateTime.fromSQL(availableDates[0].startDate).startOf('day'));
  const [maxDate, setMaxDate] = useState(DateTime.fromSQL(availableDates[0].endDate).startOf('day'));
  const [selectedStartBookDate, setSelectedStartBookDate] = useState(DateTime.fromSQL(availableDates[0].startDate).startOf('day'));
  const [selectedEndBookDate, setSelectedEndBookDate] = useState(DateTime.fromSQL(availableDates[0].endDate).startOf('day'));
  const [dates, setDates] = useState([{ startDate: DateTime.now().startOf('day'), endDate: DateTime.now().startOf('day').plus({ days: 1 }) }]);
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);

  useEffect(() => {
    if (open === true) {
      setDates([{ startDate: DateTime.now().startOf('day'), endDate: DateTime.now().startOf('day').plus({ days: 1 }) }]);
    }
  }, [open])

  const handleDateSelectInput = (event) => {
    setSelectedDateRange(event.target.value);
  }

  const handleDatesInput = (newValue, fieldname) => {
    try {
      const currentendDate = fieldname === 'endDate' ? newValue : dates[index].endDate;
      const currentstartDate = fieldname === 'startDate' ? newValue : dates[index].startDate;
      if (currentendDate.diff(currentstartDate, ['days']).days <= 0) {
        throw new Error('Start Date must be less than end date')
      }
      const values = [...dates];
      values[index] = { ...values[index], [fieldname]: newValue };
      setDates(values);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1]('Start Date must be less than end date');
      openModal[1](true);
    }
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
              <MenuItem key={index} value={`${obj.startDate} - ${obj.endDate}`}>{`${obj.startDate} - ${obj.endDate}`}</MenuItem>
            )) }
          </Select>
          <DialogContentText sx={{ mb: 2 }}>
            2. Pick your date
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: 2, justifyContent: 'center' }}>
              <Box>
                <Typography id={'label-for-start-date'}>
                  Start Date
                </Typography>
                <DatePicker aria-labelledby={'label-for-start-date'} minDate={minDate} maxDate={maxDate} value={selectedStartBookDate} onChange={(newValue) => { handleDatesInput(newValue, 'startDate') }} disableHighlightToday/>
                <Typography id={`label-for-end-date-${index}`}>
                  End Date
                </Typography>
                <DatePicker aria-labelledby={`label-for-end-date-${index}`} minDate={dateObj.startDate.plus({ days: 1 })} value={dateObj.endDate} onChange={(newValue) => { handleDatesInput(index, newValue, 'endDate') }} disableHighlightToday/>
              </Box>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => bookFunction() }>Go Live</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default BookingModal;
