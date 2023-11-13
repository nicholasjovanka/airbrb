import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { capitalizeFirstLetter } from '../utils/utils';

import { Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

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

const BookingPagination = ({ bookingArray }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bookings, setBookings] = useState([]);
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
      id: 'action',
      label: 'Actions',
      minWidth: 100,
      align: 'left',
    }
  ];

  useEffect(() => {
    setBookings(bookingArray);
    setPage(0)
    console.log(bookingArray.length);
  }, [bookingArray])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookings.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500, borderCollapse: 'separate' }} aria-label='bookings table'>
        <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: 'black', color: 'white', ...(index === 4 && { position: 'sticky', right: 0 }) }}
                  variant='head'
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        <TableBody>
          {bookings.length > 0 && (rowsPerPage > 0
            ? bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : bookings
          ).map((row, index) => (
            <TableRow key={index}>
              <TableCell component='th' scope='row' style={{ zIndex: 1 }}>
                {row.owner}
              </TableCell>
              <TableCell align='left' style={{ zIndex: 1 }}>
               { capitalizeFirstLetter(row.status) }
              </TableCell>
              <TableCell align='left' style={{ zIndex: 1 }}>
                {row.dateRange.startDate} - {row.dateRange.endDate}
              </TableCell>
              <TableCell align='left' style={{ zIndex: 1 }}>
                {row.totalPrice}
              </TableCell>
              <TableCell align='left' style={{ position: 'sticky', right: 0, border: '2px solid', zIndex: 4, background: 'white' }}>
                <Button>
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && (
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
          {bookings.length > 0 && <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={5}
              count={bookings.length}
              rowsPerPage={rowsPerPage}
              page={page}
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
  );
}

export default BookingPagination
