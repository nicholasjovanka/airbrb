import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Box, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ModalCloseButton from './ModalCloseButton';

/*
DatePicker Modal used by the hosted listing page that allows a user to make their listing go live
This datepicker modal provides a dynamic form like datepickers to allow them to input as much as date range as they want

Props Explanation
- setOpen: The state set function for the 'open' boolean state that allows the modal to close when the close button is clicked
- width: width of the modal
- goLiveFunction: Function passed from the parent which will dictate the logic needed to make a publish/ make a listing go life. Passed function can be found
in the hostedlisting/index.js file
*/
const DatePickerModal = ({ open, setOpen, goLiveFunction }) => {
  const [dates, setDates] = useState([{ startDate: DateTime.now().startOf('day'), endDate: DateTime.now().startOf('day').plus({ days: 1 }) }]);

  /*
  Function that allow the user to add more date range to the form where the new 2 datepickers (one for that date range start date and other for the end date) by default w
  will have their start date set to today and end date to tommorow
  */
  const handleAddDates = () => {
    setDates([...dates, { startDate: DateTime.now().startOf('day'), endDate: DateTime.now().startOf('day').plus({ days: 1 }) }]);
  };

  /*
  UseEffect to reset the DatePicker Modal form so that if the user has previously used it to make another listing go live, it will not have the previous date values of the
  previous listing
  */
  useEffect(() => {
    if (open === true) {
      setDates([{ startDate: DateTime.now().startOf('day'), endDate: DateTime.now().startOf('day').plus({ days: 1 }) }]);
    }
  }, [open]);

  /*
  Function that handle the onChange event for the datepicker to update the dates state object that stores the dates
  */
  const handleDatesInput = (index, newValue, fieldname) => {
    const values = [...dates];
    values[index] = { ...values[index], [fieldname]: newValue };
    setDates(values);
  };

  /*
  Function that will remove an availability date range that the user has previously added
  */
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
        <ModalCloseButton handleClose={handleClose}/>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the dates that your listing will be available for rent
          </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
          {dates.map((dateObj, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: index === (dates.length - 1) ? 0 : 2, justifyContent: 'center' }}>
              <Box>
                <Typography id={`label-for-start-date-${index}`}>
                  Start Date
                </Typography>
                <DatePicker aria-labelledby={`label-for-start-date-${index}`} maxDate={dateObj.endDate.minus({ days: 1 })} value={dateObj.startDate} onChange={(newValue) => { handleDatesInput(index, newValue, 'startDate') }} disableHighlightToday/>
                <Typography id={`label-for-end-date-${index}`}>
                  End Date
                </Typography>
                <DatePicker aria-labelledby={`label-for-end-date-${index}`} minDate={dateObj.startDate.plus({ days: 1 })} value={dateObj.endDate} onChange={(newValue) => { handleDatesInput(index, newValue, 'endDate') }} disableHighlightToday/>
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

export default DatePickerModal;
