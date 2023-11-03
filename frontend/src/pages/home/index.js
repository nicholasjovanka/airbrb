import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { apiCall } from '../../utils/utils';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';

export default function Home () {
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalListings, setOriginalListings] = useState([]);

  const handleBasicInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchFilter = () => {
    const regex = new RegExp(`${searchQuery}`, 'i');
    const filteredListings = originalListings.filter((listing) => regex.test(listing.title) || regex.test(listing.address))
    setListings(filteredListings);
  }

  useEffect(() => {
    const getListings = async () => {
      try {
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
        console.log(originalListings);
        let listingsBelongingToOwner = []
        for (const listing of listingsArray) {
          const listingDetails = await apiCall(`listings/${listing.id}`, 'GET');
          listingsBelongingToOwner.push({ ...listingDetails.data.listing, id: listing.id });
        }
        listingsBelongingToOwner = listingsBelongingToOwner.map((listing) => {
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
        setOriginalListings(listingsBelongingToOwner);
        setListings(listingsBelongingToOwner);
      } catch (error) {
        modalHeader[1]('Error');
        const errorMessage = error.response ? error.response.data.error : error.message;
        modalMessage[1](errorMessage);
        openModal[1](true);
      }
    }
    getListings();
  }, [])

  return (
      <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          Welcome To AirBRB
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', mx: 3 }}>
        <TextField
              required
              id='search'
              name='search'
              label='Search Filter'
              fullWidth
              type= 'text'
              variant='standard'
              value={searchQuery}
              onChange={handleBasicInput}
              sx={{ maxWidth: 'sm' }}
            />
        <Button sx={{ float: 'right' }} variant='contained' onClick={searchFilter}>
          Search
        </Button>
        </Box>
        <ListingPagination listingsArray={listings}></ListingPagination>
      </Box>
  )
}
