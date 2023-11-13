import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { apiCall, capitalizeFirstLetter } from '../utils/utils';
import { StoreContext } from '../utils/states';

import { Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Button, Box, Paper, IconButton, Select, MenuItem, InputLabel } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ConfirmationModal from './ConfirmationModal';

const TablePaginationActions = (props) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const BookingPagination = ({ bookingArray, setBookingArray }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [bookingsToDisplay, setBookingsToDisplay] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [confirmationModalContent, setConfirmationModalContent] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [selectedBooking, setSelectedBooking] = useState({
    id: '',
    index: 0,
    action: 'accept'
  });
  const [paginationObj, setPaginationObj] = useState({
    bookings: [],
    page: 0,
    rowsPerPage: 5
  })

  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const columns = [
    { id: 'booker', label: 'Booker', minWidth: 100, align: 'left' },
    {
      id: 'status',
      label: 'Booking Status',
      minWidth: 100,
      align: 'left',
    },
    { id: 'date', label: 'Booking Date', minWidth: 100, align: 'left' },
    {
      id: 'price',
      label: 'Total Price',
      minWidth: 100,
      align: 'left',
    },
    {
      id: 'duration',
      label: 'Booking Duration',
      minWidth: 100,
      align: 'left',
    },
    {
      id: 'action',
      label: 'Actions',
      minWidth: 100,
      align: 'left',
    }
  ];

  useEffect(() => {
    if (initialLoad) {
      setPaginationObj({ ...paginationObj, bookings: bookingArray })
      if (bookingArray.length > 0) {
        setInitialLoad(false);
      }
    }
  }, [bookingArray])

  useEffect(() => {
    getPages(paginationObj.page);
  }, [paginationObj])

  useEffect(() => {
    if (statusFilter === 'any') {
      setPaginationObj({ ...paginationObj, page: 0, bookings: bookingArray });
    } else {
      const filteredBookings = bookingArray.filter((booking) => booking.status === statusFilter);
      setPaginationObj({ ...paginationObj, page: 0, bookings: filteredBookings });
    }
  }, [statusFilter])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    paginationObj.page > 0 ? Math.max(0, (1 + paginationObj.page) * paginationObj.rowsPerPage - paginationObj.bookings.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPaginationObj({ ...paginationObj, page: newPage });
  };

  const getPages = (newPage) => {
    const slicedBookingsArray = paginationObj.rowsPerPage > 0 ? paginationObj.bookings.slice(newPage * paginationObj.rowsPerPage, newPage * paginationObj.rowsPerPage + paginationObj.rowsPerPage) : paginationObj.bookings;
    setBookingsToDisplay(slicedBookingsArray)
  }

  const handleChangeRowsPerPage = (event) => {
    setPaginationObj({ ...paginationObj, page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const openActionModal = (bookingObj, index, action) => {
    setSelectedBooking({
      id: bookingObj.id,
      index: paginationObj.page * paginationObj.rowsPerPage + index,
      action
    })
    setConfirmationModalContent(`Are you sure you want to ${action} Booking from ${bookingObj.owner} at ${bookingObj.date} `)
    console.log(selectedBooking);
    setOpenConfirmationModal(true)
  }

  const approveRejectBooking = async () => {
    try {
      await apiCall(`bookings/${selectedBooking.action}/${selectedBooking.id}`, 'PUT');
      const index = bookingArray.map(listing => listing.id).indexOf(selectedBooking.id);
      const bookingArrayCopy = [...bookingArray];
      const updatedBooking = { ...bookingArrayCopy[index], status: selectedBooking.action === 'accept' ? 'accepted' : 'declined' }
      bookingArrayCopy[index] = updatedBooking
      setBookingArray(bookingArrayCopy);
      const previousBookingArray = [...paginationObj.bookings];
      previousBookingArray[selectedBooking.index] = updatedBooking;
      if (statusFilter === 'pending') {
        previousBookingArray.splice(selectedBooking.index, 1);
        const newNumberOfPage = Math.ceil(paginationObj.bookings.length / paginationObj.rowsPerPage) - 2;
        const pageToGoTo = paginationObj.page > newNumberOfPage ? newNumberOfPage : paginationObj.page;
        console.log(pageToGoTo);
        setPaginationObj({ ...paginationObj, page: pageToGoTo, bookings: previousBookingArray });
      } else {
        setPaginationObj({ ...paginationObj, bookings: previousBookingArray });
      }
      setOpenConfirmationModal(false);
      modalHeader[1]('Success');
      modalMessage[1](`Succesfully ${selectedBooking.action} bookings`);
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }
  return (
    <React.Fragment>
      <InputLabel id='label-for-bookings-filter-select' sx={{ mb: 2 }} >Filter Booking by Status </InputLabel>
      <Select
        labelId='label-for-bookings-filter-select'
        name='filterStatus'
        id='select-booking-status-filter'
        label="Filter Booking Status"
        value={statusFilter}
        onChange={handleStatusFilterChange}
        sx={{ width: 1 }}
        >
        <MenuItem value={'any'}>Any</MenuItem>
        <MenuItem value={'pending'}>Pending</MenuItem>
        <MenuItem value={'accepted'}>Accepted</MenuItem>
        <MenuItem value={'declined'}>Declined</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500, borderCollapse: 'separate' }} aria-label='bookings table'>
          <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: 'black', color: 'white', ...(index === 5 && { position: 'sticky', right: 0 }) }}
                    variant='head'
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          <TableBody>
            {bookingsToDisplay.length > 0 && bookingsToDisplay.map((booking, index) => (
              <TableRow key={index}>
                <TableCell component='th' scope='row' style={{ zIndex: 1 }}>
                  {booking.owner}
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                { capitalizeFirstLetter(booking.status) }
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                  {booking.date}
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                  {booking.totalPrice}
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                  {booking.duration}
                </TableCell>
                <TableCell align='left' style={{ position: 'sticky', right: 0, border: '1px solid', zIndex: 4, background: 'white' }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button variant='outlined' size='small' sx={{ flex: 1 }} disabled={booking.status !== 'pending'} onClick={(e) => { openActionModal(booking, index, 'accept') }}>
                      Approve
                    </Button>
                    <Button variant='outlined' color='error' size='small' sx={{ flex: 1 }} disabled={booking.status !== 'pending'} onClick={(e) => { openActionModal(booking, index, 'decline') }}>
                      Decline
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginationObj.bookings.length === 0 && (
                <TableRow key={2}>
                <TableCell component='th' scope='row' align='center' colSpan={3}>
                  No Bookings Found
                </TableCell>
              </TableRow>)
            }
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {paginationObj.bookings.length > 0 && <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={paginationObj.bookings.length}
                rowsPerPage={paginationObj.rowsPerPage}
                page={paginationObj.page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>}
          </TableFooter>
        </Table>
    </TableContainer>
    <ConfirmationModal content={confirmationModalContent} open={openConfirmationModal} setOpen={setOpenConfirmationModal} confirmFunction={approveRejectBooking}/>
    </React.Fragment>
  );
}

export default BookingPagination
