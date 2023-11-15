import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { apiCall, addAverageRatingAndNumberOfBedroomsToListing, listingObjectValidator } from '../../utils/utils';
import AddIcon from '@mui/icons-material/Add';
import { StoreContext } from '../../utils/states';
import ListingPagination from '../../components/ListingPagination';
import CreateListingModal from '../../components/CreateListingModal';
import ProfitBar from '../../components/ProfitBar';

const HostedListing = () => {
  const { openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const [listings, setListings] = useState([]);
  const [openCreateListingModal, setOpenCreateListingModal] = useState(false);
  const { email } = useParams();
  const [listingIds, setListingIds] = useState([]);
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
        const listingBelongingToOwnerIds = listingsBelongingToOwner.map((listing) => listing.id);
        setListingIds(listingBelongingToOwnerIds);
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

  const createNewListing = async (formObject, bedroomArray, amenities) => {
    try {
      openBackdrop[1](true)
      formObject = { ...formObject, price: Number(formObject.price), bathrooms: Number(formObject.bathrooms) };
      bedroomArray = bedroomArray.map((e) => { return { type: e.type, beds: Number(e.beds) } });
      listingObjectValidator(formObject, bedroomArray, amenities);
      const { title, street, city, state, postcode, country, price, thumbnail, ...metadata } = formObject
      const requestObject = {
        title,
        address: {
          street,
          city,
          state,
          postcode,
          country
        },
        price,
        thumbnail,
        metadata: {
          bedrooms: bedroomArray,
          amenities: amenities.filter((amenity) => amenity.trim().length > 0),
          ...metadata
        }
      }
      const request = await apiCall('listings/new', 'POST', requestObject);
      let newListingObject = {
        id: request.data.listingId,
        reviews: [],
        availability: [],
        published: false,
        postedOn: null,
        ...requestObject
      }
      newListingObject = addAverageRatingAndNumberOfBedroomsToListing(newListingObject)
      const listingShallowCopy = [...listings, newListingObject]
      setListings(listingShallowCopy)
      setOpenCreateListingModal(false);
      modalHeader[1]('Success');
      modalMessage[1]('Sucessfully Created Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    } finally {
      openBackdrop[1](false)
    }
  }

  return (
      <React.Fragment>
        <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          My Hosted Listings
        </Typography>
        <Typography align='center' variant= 'h6' sx={{ mt: 1 }}>
          Listing Profit in the past 30 days
        </Typography>
        <Box sx={{ mx: 'auto', overflow: 'scroll', width: '100%', maxWidth: 'md', p: 2, border: '1px solid' }}>
            <ProfitBar listingIds={listingIds} />
        </Box>
        <Tooltip title="Add New Listings">
          <Button variant="contained" endIcon={<AddIcon />} aria-label="Add Listing" sx={{ mx: 'auto' }} onClick={() => setOpenCreateListingModal(true)}>
            Create Listing
          </Button>
        </Tooltip>
        <ListingPagination listingsArray={listings} displayPage='hostedlisting' ></ListingPagination>
      </Box>
      <CreateListingModal open={openCreateListingModal} setOpen={setOpenCreateListingModal} createListingFunction={createNewListing}/>
      </React.Fragment>
  )
}

export default HostedListing
