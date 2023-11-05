import React, { useState, useContext, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { StoreContext } from '../utils/states';

export default function DatePickerModal ({ open, setOpen, goLiveFunction }) {
  const [dates, setDates] = useState([{ startdate: DateTime.now(), enddate: DateTime.now().plus({ days: 1 }) }]);
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const handleAddDates = () => {
    setDates([...dates, { startdate: DateTime.now(), enddate: DateTime.now().plus({ days: 1 }) }]);
  };

  useEffect(() => {
    if (open === true) {
      setDates([{ startdate: DateTime.now(), enddate: DateTime.now().plus({ days: 1 }) }]);
    }
  }, [open])

  const handleDatesInput = (index, newValue, fieldname) => {
    try {
      const currentEndDate = fieldname === 'enddate' ? newValue : dates[index].enddate;
      const currentStartDate = fieldname === 'startdate' ? newValue : dates[index].startdate;
      if (currentEndDate.diff(currentStartDate, ['days']).days <= 0) {
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

  const handleRemoveDate = (index) => {
    const values = [...dates];
    values.splice(index, 1);
    setDates(values);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby ='datepicker-dialog-title'
      maxWidth = 'sm'
      fullWidth
      scroll = 'paper'
      >
        <DialogTitle id='datepicker-dialog-title'> Pick your dates</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the dates that your listing will be available for rent
          </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
          {dates.map((dateObj, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: index === (dates.length - 1) ? 0 : 2, justifyContent: 'center' }}>
              <Box>
                <Typography>
                  Start Date
                </Typography>
                <DatePicker maxDate={dateObj.enddate.minus({ days: 1 })} value={dateObj.startdate} onChange={(newValue) => { handleDatesInput(index, newValue, 'startdate') }} disableHighlightToday/>
                <Typography>
                  End Date
                </Typography>
                <DatePicker minDate={dateObj.startdate.plus({ days: 1 })} value={dateObj.enddate} onChange={(newValue) => { handleDatesInput(index, newValue, 'enddate') }} disableHighlightToday/>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                <IconButton onClick={() => handleAddDates()}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => handleRemoveDate(index)} disabled = {index === 0}>
                  <RemoveIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => goLiveFunction(dates) }>Go Live</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
