import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { apiCall, capitalizeFirstLetter } from '../utils/utils';
import { StoreContext } from '../utils/states';

import { Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Button, Box, Paper, IconButton, Select, MenuItem, InputLabel, useTheme } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ConfirmationModal from './ConfirmationModal';

/*
Table Pagination Customization provided by Material UI which adds a go to last page button for pagination
*/
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

/*
Component that allows the user to paginate the bookings passed in the bookingArray in the form of a table.
This component is used both by the ManageBookings page and the listing page to allow a user to see their bookings

Props Explanation
- bookingArray: Array containing all the bookings that will be spliced into pages for pagination displayed in the component
- setBookingArray: Function passed from the parent that allows this component to modify bookingArray in the parent component, Needed for Approve and rejecting the bookings in
the manage booking page to ensure that original array is updated
- viewMode: A boolean that tells the component if its currently only being used to view bookings or is currently being used to manage (Approve/ decline) bookings as
this component is used in both the ManageBooking and listing detail page.
*/
const BookingPagination = ({ bookingArray, setBookingArray, viewMode = false }) => {
  const [initialLoad, setInitialLoad] = useState(true); // State variable to check if its currently the initial load of data. its use will be explained in the useEffect below later
  const [bookingsToDisplay, setBookingsToDisplay] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [confirmationModalContent, setConfirmationModalContent] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [columns, setColumns] = useState([
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
    }
  ]);
  const [selectedBooking, setSelectedBooking] = useState({
    id: '',
    index: 0,
    action: 'accept'
  });
  const [paginationObj, setPaginationObj] = useState({
    bookings: [],
    page: 0,
    rowsPerPage: 5
  });

  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);

  /*
  Use Effect to update the columns that is displayed in the column table where if the viewMode is false (means that its in the manage booking page),
  also show the booker column which shows the user who made the booking, and also render the actions column which contains the button that is needed for a
  listing owner to approve and reject a listing
  */
  useEffect(() => {
    if (!viewMode) {
      setColumns([
        {
          id: 'booker',
          label: 'Booker',
          minWidth: 100,
          align: 'left'
        },
        ...columns,
        {
          id: 'action',
          label: 'Actions',
          minWidth: 100,
          align: 'left',
        }]);
    }
  }, [viewMode]);

  /*
  Use Effect to initially populate the bookings attribute inside the paginationObj state.
  Here we use the initialLoad state variable to ensure that this useEffect only runs when the Pagination component receives a non empty array.
  This is done to prevent the BookingPagination page from changing when the bookingArray in the parent is modified as the approveRejectBooking function
  inside the component modifies the bookingArray in the parent when the listing owner approves or reject a listing. This way after the initial load, all the page
  changes will only be effected by the useEffect bellow, this way the functionality where the page updates when the user approve or reject a booking while using the pending
  filter can function
  */
  useEffect(() => {
    if (initialLoad) {
      setPaginationObj({ ...paginationObj, bookings: bookingArray });
      if (bookingArray.length > 0 && !viewMode) {
        setInitialLoad(false);
      }
    }
  }, [bookingArray]);

  /*
  Use Effect to rerender the bookings table based on the object inside the paginationObj.
  This will occur when the user either approve or reject a booking, change the page, or change the amount of row per page
  */
  useEffect(() => {
    getPages(paginationObj.page);
  }, [paginationObj]);

  /*
  Use Effect to filter the bookings that is displayed in the bookings table based on the filter that the user select
  */
  useEffect(() => {
    if (statusFilter === 'any') {
      setPaginationObj({ ...paginationObj, page: 0, bookings: bookingArray });
    } else {
      const filteredBookings = bookingArray.filter((booking) => booking.status === statusFilter);
      setPaginationObj({ ...paginationObj, page: 0, bookings: filteredBookings });
    }
  }, [statusFilter]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    paginationObj.page > 0 ? Math.max(0, (1 + paginationObj.page) * paginationObj.rowsPerPage - paginationObj.bookings.length) : 0;

  /*
  Function that handles the page change when the user clicks the next or prev button on the booking table pagination
  */
  const handleChangePage = (event, newPage) => {
    setPaginationObj({ ...paginationObj, page: newPage });
  };

  /*
  Function that will slice the bookingArray based on the rows per page and the current selected table page and set them to the bookingToDisplay state to
  update the bookings displayedon the table
  */
  const getPages = (newPage) => {
    const slicedBookingsArray = paginationObj.rowsPerPage > 0 ? paginationObj.bookings.slice(newPage * paginationObj.rowsPerPage, newPage * paginationObj.rowsPerPage + paginationObj.rowsPerPage) : paginationObj.bookings;
    setBookingsToDisplay(slicedBookingsArray);
  }

  /*
  Function that handles the row per page option change in the booking table pagination which will trigger the useEffect to rerender the
  bookings back to page 0 where the amount of bookings displayed is equal to the new rowsPerPage option selected by the user
  */
  const handleChangeRowsPerPage = (event) => {
    setPaginationObj({ ...paginationObj, page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  /*
  Function that handles the status selection change by the user which will trigger a useEffect which in turn will now show bookings in the
  booking table based on the filter that the user chooses
  */
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  /*
  Function that will open the Confirmation modal when the user clicks either the approve or reject button in the action column of the table.
  */
  const openActionModal = (bookingObj, index, action) => {
    setSelectedBooking({
      id: bookingObj.id,
      index: paginationObj.page * paginationObj.rowsPerPage + index,
      action
    });
    setConfirmationModalContent(`Are you sure you want to ${action} Booking from ${bookingObj.owner} at ${bookingObj.date} `);
    setOpenConfirmationModal(true);
  }

  /*
  Function that will either approve the booking or reject booking based on the action that was set in the selectedBooking state. The booking shown on the
  table will update in real time after the function executes. If the user is currently viewing the booking table using the pending filter, booking
  that have been approved and rejected will dissapear from the booking view with pending filter in real time after the function executes. If the booking that is currently
  approved/rejected is the last booking in the current view page when user use the pending filter, then it will move the user back by one page with the pending filter (if the current page
  is not the first page)
  */
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
        const newNumberOfPage = Math.ceil(previousBookingArray.length / paginationObj.rowsPerPage) - 1;
        const pageToGoTo = paginationObj.page > newNumberOfPage ? newNumberOfPage : paginationObj.page;
        setPaginationObj({ ...paginationObj, page: pageToGoTo, bookings: previousBookingArray });
      } else {
        setPaginationObj({ ...paginationObj, bookings: previousBookingArray });
      }
      setOpenConfirmationModal(false);
      modalHeader[1]('Success');
      modalMessage[1](`Succesfully ${selectedBooking.action} booking`);
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
        sx={{ width: 1, maxWidth: 'sm', mb: 2 }}
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
                {!viewMode && (
                  <TableCell component='th' scope='row' style={{ zIndex: 1 }}>
                    {booking.owner}
                  </TableCell>
                )}
                <TableCell align='left' style={{ zIndex: 1 }}>
                { capitalizeFirstLetter(booking.status) }
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1, textWrap: 'nowrap' }}>
                  {booking.date}
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                  {booking.totalPrice}
                </TableCell>
                <TableCell align='left' style={{ zIndex: 1 }}>
                  {booking.duration}
                </TableCell>
                { !viewMode && (
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
                )}
              </TableRow>
            ))}
            {paginationObj.bookings.length === 0 && (
                <TableRow key={2}>
                <TableCell component='th' scope='row' align='center' colSpan={columns.length}>
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
                colSpan={Object.keys(columns).length}
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
