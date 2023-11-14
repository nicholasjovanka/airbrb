import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, addAverageRatingAndNumberOfBedroomsToListing } from '../../utils/utils';
import AddIcon from '@mui/icons-material/Add';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';

const HostedListing = () => {
  const navigate = useNavigate()
  const { openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const [listings, setListings] = useState([]);
  const { email } = useParams();
  useEffect(() => {
    const getListings = async () => {
      try {
        openBackdrop[1](true)
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
          return addAverageRatingAndNumberOfBedroomsToListing(listing);
        })
        setListings(listingsBelongingToOwner);
      } catch (error) {
        modalHeader[1]('Error');
        const errorMessage = error.response ? error.response.data.error : error.message;
        modalMessage[1](errorMessage);
        openModal[1](true);
      } finally {
        openBackdrop[1](false)
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
        <ListingPagination listingsArray={listings} displayPage='hostedlisting' ></ListingPagination>
      </Box>
  )
}

export default HostedListing
