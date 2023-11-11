import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, Checkbox, Grid, InputLabel, InputAdornment, Select, MenuItem } from '@mui/material';
import { apiCall } from '../../utils/utils';
import { DateTime } from 'luxon';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Home = () => {
  const { openModal, modalHeader, modalMessage, loggedIn } = useContext(StoreContext);
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalListings, setOriginalListings] = useState([]);
  const [showLoadingBar, setShowLoadingBar] = useState({ display: 'none', mx: 'auto', mt: 5 });
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

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

  useEffect(() => {
    const getListings = async () => {
      try {
        setShowLoadingBar({ ...showLoadingBar, display: 'flex' });
        const listingsApiCall = await apiCall('listings', 'GET');
        console.log(listingsApiCall.data.listings)
        const listingsArray = listingsApiCall.data.listings.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else if (a.title.toLowerCase() === b.title.toLowerCase()) {
            return 0;
          } else {
            return 1;
          }
        });
        let listingWithDetails = []
        for (const listing of listingsArray) {
          const listingDetails = await apiCall(`listings/${listing.id}`, 'GET');
          listingWithDetails.push({ ...listingDetails.data.listing, id: listing.id });
        }
        listingWithDetails = listingWithDetails.filter((listing) => listing.availability.length > 0)
        listingWithDetails = listingWithDetails.map((listing) => {
          let numberOfBedrooms = 0;
          let averageRating = 0;
          listing.metadata.bedrooms.forEach((room) => {
            numberOfBedrooms += room.beds
          })

          listing.reviews.forEach((review) => {
            averageRating += review.rating
          })
          averageRating = listing.reviews.length > 0 ? (averageRating / listing.reviews.length).toFixed(2) : null
          return { ...listing, numberOfBedrooms, averageRating }
        })
        console.log(loggedIn[0]);
        loggedIn[1](true);
        if (loggedIn[0]) {
          const userEmail = localStorage.getItem('userEmail');
          const bookings = await apiCall('bookings', 'GET');
          console.log(bookings);
          const bookingTiedToUser = bookings.data.bookings.filter((booking) => booking.owner === userEmail);
          const listingsWithBooking = []
          for (let i = 0; i < bookingTiedToUser.length; i++) {
            const listingWithBookingIndex = listingWithDetails.map(listing => listing.id).indexOf(bookingTiedToUser[i].id);
            const splicedListing = listingWithDetails.splice(listingWithBookingIndex, 1);
            console.log(listingWithDetails);
            const listingWithStatus = { ...splicedListing[0], status: bookingTiedToUser[i].status };
            listingsWithBooking.push(listingWithStatus)
          }
          listingWithDetails = [...listingsWithBooking, ...listingWithDetails];
        }
        setOriginalListings(listingWithDetails);
        setListings(listingWithDetails);
        console.log(listingWithDetails);
      } catch (error) {
        modalHeader[1]('Error');
        const errorMessage = error.response ? error.response.data.error : error.message;
        modalMessage[1](errorMessage);
        openModal[1](true);
      } finally {
        setShowLoadingBar({ ...showLoadingBar, display: 'none' });
      }
    }
    getListings();
  }, [])

  const handlExtraFilterInput = (event) => {
    const regex = /FilterOn$/i;
    if (regex.test(event.target.name)) {
      setExtraFilterObj({ ...extraFilterObj, [event.target.name]: event.target.checked });
    } else {
      setExtraFilterObj({ ...extraFilterObj, [event.target.name]: event.target.value });
    }
  };

  const handleDatesInput = (newValue, fieldname) => {
    setExtraFilterObj({ ...extraFilterObj, [fieldname]: newValue })
  };

  const searchFilter = () => {
    try {
      const regex = new RegExp(`${searchQuery}`, 'i');
      let filteredListings = originalListings.filter((listing) => regex.test(listing.title) || regex.test(listing.address));
      if (extraFilterObj.bedroomFilterOn) {
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
      if (extraFilterObj.dateFilterOn) {
        filteredListings = filteredListings.filter((listing) => listing.availability.filter((availabilityDates) => {
          return (DateTime.fromSQL(availabilityDates.startDate).diff(extraFilterObj.startDate, ['days']).toObject().days >= 0 && DateTime.fromSQL(availabilityDates.endDate).diff(extraFilterObj.endDate, ['days']).toObject().days <= 0);
        }).length > 0
        );
      }
      if (extraFilterObj.priceFilterOn) {
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
      if (extraFilterObj.ratingFilterOn) {
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
            <TextField id='search-bar-property-name-and-city' name='searchbar' fullWidth type= 'text' variant='standard' value={searchQuery} onChange={handleSearchInput} sx={{ maxWidth: 'sm' }}/>
            <Button sx={{ float: 'right' }} variant='contained' onClick={searchFilter}>
              Search
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ justifyContent: 'center', px: 2 }}>
          <Grid item xs={12}>
            <Typography sx={{ mx: 3, textAlign: 'center' }}>
              Additional Filters Below , Turn on the checkbox for each filters to turn them on
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
        <CircularProgress sx={showLoadingBar} size="10rem"/>
        <ListingPagination listingsArray={listings} displayPage='home'></ListingPagination>
      </Box>
  )
}

export default Home
