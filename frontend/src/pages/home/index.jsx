import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, Checkbox, Grid, InputLabel, InputAdornment, Select, MenuItem } from '@mui/material';
import { apiCall, getLuxonDayDifference, addAverageRatingAndNumberOfBedsToListing } from '../../utils/utils';
import { DateTime } from 'luxon';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';

/*
Home Page Component that represents the home page of the website
*/
const Home = () => {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalListings, setOriginalListings] = useState([]);

  const { openModal, modalHeader, modalMessage, loggedIn, openBackdrop } = useContext(StoreContext);
  /*
  The dateFilterOn, startDate, and endDate value inside the extraFilterObj will be passed to the Listing Pagination component where if the dateFilterOn is true then it will tell the
  Listing Card Component inside the Listing Pagination Component to navigate to the listing detail page with startDate and endDate as the query string
  */
  const [extraFilterObj, setExtraFilterObj] = useState({
    bedroomFilterOn: false,
    minBedroom: 0,
    maxBedroom: 4,
    dateFilterOn: false,
    startDate: DateTime.now().startOf('day'),
    endDate: DateTime.now().startOf('day').plus({ days: 1 }),
    priceFilterOn: false,
    minPrice: 0,
    maxPrice: 100,
    ratingFilterOn: false,
    sortBy: 'highest-rating'
  });

  /*
  useEffect that will fetch all the listings from the backend server and then get the details of each listing and then
  pass the listings to the ListingPagination component.
  */
  useEffect(() => {
    const getListings = async () => {
      try {
        openBackdrop[1](true);
        const listingsApiCall = await apiCall('listings', 'GET'); // Get the listings from the backend server
        const listingsArray = listingsApiCall.data.listings.sort((a, b) => { // Sort the listings alphabetically
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else if (a.title.toLowerCase() === b.title.toLowerCase()) {
            return 0;
          } else {
            return 1;
          }
        });
        let listingWithDetails = []
        for (const listing of listingsArray) { // Get the details of each listing
          const listingDetails = await apiCall(`listings/${listing.id}`, 'GET');
          listingWithDetails.push({ ...listingDetails.data.listing, id: listing.id });
        }
        listingWithDetails = listingWithDetails.filter((listing) => listing.availability.length > 0) // Filter so that only listings that has availability (live listings) is shown
        listingWithDetails = listingWithDetails.map((listing) => { // Add the average rating field and number of beds field to each listing
          return addAverageRatingAndNumberOfBedsToListing(listing);
        });
        if (loggedIn[0] === true) { // If logged in check for bookings tied to each listing made by the user
          const userEmail = localStorage.getItem('userEmail');
          const bookings = await apiCall('bookings', 'GET'); // Get all bookings
          /*
          Filter the bookings so that is tied to the current logged in user whose status is either accepted or pending
          Then sort the bookings so that booking with the status accepted is always shown first
          */
          const bookingTiedToUser = bookings.data.bookings.filter((booking) => booking.owner === userEmail && booking.status !== 'declined').sort((a, b) => {
            if ((a.status === 'accepted' && b.status !== 'accepted') || (a.status === 'declined' && b.status !== 'pending')) {
              return -1;
            } else if (a.status === b.status) {
              return 0;
            } else {
              return 1;
            }
          });
          const listingsWithBooking = []; // Array to store listing with bookings
          const listingWithMultipleBooking = []; // Array to keep track of listing with multiple bookings to prevent the same listing from being displayed more than once
          for (let i = 0; i < bookingTiedToUser.length; i++) {
            const bookingListingId = Number(bookingTiedToUser[i].listingId);
            if (!listingWithMultipleBooking.includes(bookingListingId)) { // If the listing hasnt appeared before in the listingWithMultipleBooking array then add them to the listingWithBookings array
              const listingWithBookingIndex = listingWithDetails.map(listing => listing.id).indexOf(bookingListingId);
              const splicedListing = listingWithDetails.splice(listingWithBookingIndex, 1); // Remove the listing with booking from the listingWithDetails array to prevent the same listing displayed more than once
              const listingWithStatus = { ...splicedListing[0], status: bookingTiedToUser[i].status };
              listingsWithBooking.push(listingWithStatus);
              listingWithMultipleBooking.push(bookingListingId);
            }
          }
          listingWithDetails = [...listingsWithBooking, ...listingWithDetails]; // Put listing with bookings infront of other listings.
        }
        setOriginalListings(listingWithDetails);
        setListings(listingWithDetails);
      } catch (error) {
        modalHeader[1]('Error');
        const errorMessage = error.response ? error.response.data.error : error.message;
        modalMessage[1](errorMessage);
        openModal[1](true);
      } finally {
        openBackdrop[1](false);
      }
    }
    getListings();
  }, [loggedIn[0]]);

  /*
  Function that update the searchQuery state object based on the the changes in  value of the the search bar text input
  */
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  /*
  Function that update the extraFilterObj state object based on the the changes to the Date, bedroom number, price, and rating sort filter
  */
  const handlExtraFilterInput = (event) => {
    const regex = /FilterOn$/i;
    if (regex.test(event.target.name)) {
      setExtraFilterObj({ ...extraFilterObj, [event.target.name]: event.target.checked });
    } else {
      setExtraFilterObj({ ...extraFilterObj, [event.target.name]: event.target.value });
    }
  };

  /*
  Function that allows the user to trigger a search by pressing enter key in the search bar instead of pressing the search button
  */
  const handleSearchBarEnter = (event) => {
    if (event.keyCode === 13) {
      searchFilter();
    }
  }

  /*
  Function that handles the date changes input for the date filter
  */
  const handleDatesInput = (newValue, fieldname) => {
    setExtraFilterObj({ ...extraFilterObj, [fieldname]: newValue });
  };

  /*
  Function that filters the listings from the intial load of the page (stored in the originalListings state variable) to match the
  Listing name, location filter based on the text in the search bar along with any additional filters if the other filters is enabled
  (Other filters include Number of bedroosm, date range, price, and rating sort)
  */
  const searchFilter = () => {
    try {
      const regex = new RegExp(`${searchQuery}`, 'i');
      // Filter the listings based on the term in the search bar using regex
      let filteredListings = originalListings.filter((listing) => regex.test(listing.title) || regex.test(listing.address.street) || regex.test(listing.address.city) || regex.test(listing.address.state) || regex.test(listing.address.postcode) || regex.test(listing.address.country));
      if (extraFilterObj.bedroomFilterOn) { // If the number of bedroom filter is on then filter the listing based on it
        const minNumberOfBedroom = Number(extraFilterObj.minBedroom);
        const maxNumberOfBedroom = Number(extraFilterObj.maxBedroom);
        if (minNumberOfBedroom < 0 || maxNumberOfBedroom < 0) {
          throw new Error('Minimum and Maximum Number of Bedroom must be above 0');
        }
        if (minNumberOfBedroom > maxNumberOfBedroom) {
          throw new Error('Minimum Number of Bedroom must be below Maximum Number of Bedroom');
        }
        filteredListings = filteredListings.filter((listing) => listing.metadata.bedrooms.length <= maxNumberOfBedroom && listing.metadata.bedrooms.length >= minNumberOfBedroom);
      }
      if (extraFilterObj.dateFilterOn) { // If the date range bedroom filter is on then filter the listing based on it
        if (getLuxonDayDifference(extraFilterObj.startDate, extraFilterObj.endDate) <= 0) {
          throw new Error('Filter Start Date must be smaller than End Date');
        }
        filteredListings = filteredListings.filter((listing) => listing.availability.filter((availabilityDates) => {
          return (getLuxonDayDifference(extraFilterObj.startDate, DateTime.fromSQL(availabilityDates.startDate)) >= 0 && getLuxonDayDifference(extraFilterObj.endDate, DateTime.fromSQL(availabilityDates.endDate)) <= 0);
        }).length > 0
        );
      }
      if (extraFilterObj.priceFilterOn) { // If the price filter is on then filter the listing based on it
        const minPrice = Number(extraFilterObj.minPrice);
        const maxPrice = Number(extraFilterObj.maxPrice);
        if (minPrice < 0 || maxPrice < 0) {
          throw new Error('Minimum and Maximum Price must be above 0');
        }
        if (minPrice > maxPrice) {
          throw new Error('Minimum Price cannot be bigger than Maximum Price');
        }
        filteredListings = filteredListings.filter((listing) => listing.price <= maxPrice && listing.price >= minPrice);
      }
      if (extraFilterObj.ratingFilterOn) { // If the rating sort filter is on then sort the listing based on the rating filter that is selected
        if (extraFilterObj.sortBy === 'highest-rating') {
          filteredListings = filteredListings.sort((a, b) => {
            const aRating = a.averageRating === null ? -1 : a.averageRating
            const bRating = b.averageRating === null ? -1 : a.averageRating
            if (aRating < bRating) {
              return 1;
            } else if (aRating === bRating) {
              return 0;
            } else {
              return -1;
            }
          });
        } else {
          filteredListings = filteredListings.sort((a, b) => {
            const aRating = a.averageRating === null ? -1 : a.averageRating
            const bRating = b.averageRating === null ? -1 : a.averageRating
            if (aRating < bRating) {
              return -1;
            } else if (aRating === bRating) {
              return 0;
            } else {
              return 1;
            }
          });
        }
      }
      setListings(filteredListings);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  return (
      <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          Welcome To AirBRB
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mx: 3, alignItems: 'center' }}>
          <InputLabel htmlFor='search-bar-property-name-and-city'>Search By Property Name and City</InputLabel>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', width: 1 }}>
            <TextField id='search-bar-property-name-and-city' name='searchbar' fullWidth type= 'text' variant='standard' value={searchQuery} onChange={handleSearchInput} sx={{ maxWidth: 'sm' }} onKeyDown={handleSearchBarEnter}/>
            <Button sx={{ float: 'right' }} variant='contained' onClick={searchFilter}>
              Search
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ justifyContent: 'center', px: 2 }}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ mx: 3, textAlign: 'center' }}>
              Additional Filters Below , Turn on the checkbox for each filters to turn them on and click Search
            </Typography>
          </Grid>
          <Grid item xs={12} xl={2} lg={3} md={5} >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, height: '100%' }}>
              <Box sx= {{ flexGrow: 1 }}>
                <Typography variant='h6'>Filter by bedroom number</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <InputLabel htmlFor='minBedroom'>Minimum Number of Bedroom</InputLabel>
                    <TextField id='minBedroom' name='minBedroom' fullWidth type= 'number' variant='standard' value={extraFilterObj.minBedroom} onChange={handlExtraFilterInput}/>
                  </Box>
                  <Box>
                  <InputLabel htmlFor='maxBedroom'>Maximum Number of Bedroom</InputLabel>
                    <TextField id='maxBedroom' name='maxBedroom' fullWidth type= 'number' variant='standard' value={extraFilterObj.maxBedroom} onChange={handlExtraFilterInput}/>
                  </Box>
                </Box>
              </Box>
              <Checkbox name='bedroomFilterOn' inputProps={{ 'aria-label': 'Enable Number of Bedroom Filter Checkbox' }} value={extraFilterObj.bedroomFilterOn} onChange={handlExtraFilterInput}/>
            </Box>
          </Grid>
          <Grid item xs={12} xl={2} lg={3} md={5} >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, height: '100%' }}>
              <Box sx= {{ flexGrow: 1 }}>
                <Typography variant='h6'>Filter by Availability Date </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='en-gb'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center' }}>
                    <Box>
                      <Typography>
                        Start Date
                      </Typography>
                      <DatePicker disableHighlightToday maxDate={extraFilterObj.endDate.minus({ days: 1 })} value={extraFilterObj.startDate} onChange={(newValue) => { handleDatesInput(newValue, 'startDate') }}/>
                    </Box>
                    <Box>
                      <Typography>
                        End Date
                      </Typography>
                      <DatePicker disableHighlightToday minDate={extraFilterObj.startDate.plus({ days: 1 })} value={extraFilterObj.endDate} onChange={(newValue) => { handleDatesInput(newValue, 'endDate') }}/>
                    </Box>
                  </Box>
              </LocalizationProvider>
                </Box>
              </Box>
              <Checkbox name='dateFilterOn' inputProps={{ 'aria-label': 'Enable Number of Bedroom Filter Checkbox' }} value={extraFilterObj.dateFilterOn} onChange={handlExtraFilterInput}/>
            </Box>
          </Grid>
          <Grid item xs={12} xl={2} lg={3} md={5} >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, height: '100%' }}>
              <Box sx= {{ flexGrow: 1 }}>
                <Typography variant='h6'>Filter by Price</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                  <InputLabel htmlFor='minPrice'>Minimum Price Per Night</InputLabel>
                  <TextField
                        id='minPrice'
                        name='minPrice'
                        fullWidth
                        type= 'number'
                        variant='standard'
                        value={extraFilterObj.minPrice}
                        onChange={handlExtraFilterInput}
                        InputProps = {
                          {
                            endAdornment: (
                              <InputAdornment position='end'>
                               AUD/Night
                              </InputAdornment>
                            )
                          }
                        }
                  />
                  </Box>
                  <Box>
                  <InputLabel htmlFor='maxPrice'>Maximum Price Per Night</InputLabel>
                    <TextField
                          id='maxPrice'
                          name='maxPrice'
                          fullWidth
                          type= 'number'
                          variant='standard'
                          value={extraFilterObj.maxPrice}
                          onChange={handlExtraFilterInput}
                          InputProps = {
                            {
                              endAdornment: (
                                <InputAdornment position='end'>
                                 AUD/Night
                                </InputAdornment>
                              )
                            }
                          }
                    />
                  </Box>
                </Box>
              </Box>
              <Checkbox name='priceFilterOn' value={extraFilterObj.priceFilterOn} onChange={handlExtraFilterInput} inputProps={{ 'aria-label': 'Enable Number of Bedroom Filter Checkbox' }}/>
            </Box>
          </Grid>
          <Grid item xs={12} xl={2} lg={3} md={5} >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, height: '100%' }}>
              <Box sx= {{ flexGrow: 1 }}>
                <Typography variant='h6'>Filter By Rating</Typography>
                  <Box>
                  <InputLabel id='label-for-rating-sort-select' sx={{ mb: 2 }} >Sort Rating From </InputLabel>
                  <Select
                  labelId='label-for-rating-sort-select'
                  name='sortBy'
                  id='select-rating-sort-order'
                  label="Age"
                  value={extraFilterObj.sortBy}
                  onChange={handlExtraFilterInput}
                  sx={{ width: 1 }}
                  >
                  <MenuItem value={'highest-rating'}>Highest Rating</MenuItem>
                  <MenuItem value={'lowest-rating'}>Lowest Rating</MenuItem>
                  </Select>
                  </Box>
              </Box>
              <Checkbox name='ratingFilterOn' value={extraFilterObj.ratingFilterOn} onChange={handlExtraFilterInput} inputProps={{ 'aria-label': 'Enable Number of Bedroom Filter Checkbox' }}/>
            </Box>
          </Grid>
        </Grid>
        <ListingPagination listingsArray={listings} displayPage='home' dateFilterOn={extraFilterObj.dateFilterOn} startDate={extraFilterObj.startDate} endDate={extraFilterObj.endDate}></ListingPagination>
      </Box>
  )
}

export default Home
