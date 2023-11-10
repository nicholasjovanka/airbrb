import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../../utils/utils';
import AddIcon from '@mui/icons-material/Add';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';
import CircularProgress from '@mui/material/CircularProgress';

const HostedListing = () => {
  const navigate = useNavigate()
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const [listings, setListings] = useState([]);
  const [showLoadingBar, setShowLoadingBar] = useState({ display: 'none', mx: 'auto', mt: 5 });
  const { email } = useParams();
  useEffect(() => {
    const getListings = async () => {
      try {
        setShowLoadingBar({ ...showLoadingBar, display: 'flex' });
        const listingsApiCall = await apiCall('listings', 'GET');
        const listingsArray = listingsApiCall.data.listings.filter((listing) => listing.owner === email).sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else if (a.title.toLowerCase() === b.title.toLowerCase()) {
            return 0;
          } else {
            return 1;
          }
        });
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
        setListings(listingsBelongingToOwner);
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

  return (
      <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          My Hosted Listings
        </Typography>
        <Tooltip title="Add New Listings">
          <Button variant="contained" endIcon={<AddIcon />} aria-label="Add Listing" sx={{ mx: 'auto' }} onClick={() => navigate('/hostedlisting/createListing')}>
            Create Listing
          </Button>
        </Tooltip>
        <CircularProgress sx={showLoadingBar} size="10rem"/>
        <ListingPagination listingsArray={listings} displayPage='hostedlisting' ></ListingPagination>
      </Box>
  )
}

export default HostedListing
