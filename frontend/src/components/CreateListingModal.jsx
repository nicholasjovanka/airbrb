import React, { useState, useEffect, useContext } from 'react';
import ListingForm from './ListingForm';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import ModalCloseButton from './ModalCloseButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from '../utils/styles';
import { StoreContext } from '../utils/states';
import { capitalizeFirstLetter } from '../utils/utils';

const CreateListingModal = ({ open, setOpen, createListingFunction }) => {
  const [listings, setListings] = useState({});
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setListings({});
    }
  }, [open])

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    try {
      if (file.type !== 'application/json') {
        throw new Error('File Must be JSON')
      }
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      const jsonContentPromise = new Promise((resolve, reject) => {
        fileReader.onload = e => {
          resolve(e.target.result);
        };
        fileReader.onerror = (e) => reject(e);
      });
      const jsonContent = await jsonContentPromise
      const listingFormObject = JSON.parse(jsonContent);
      const nonEmptyTextFields = ['title', 'owner', 'type']
      for (let i = 0; i < nonEmptyTextFields.length; i++) {
        const fieldValue = listingFormObject[nonEmptyTextFields[i]];
        if (fieldValue) {
          if (fieldValue.trim().length === 0) {
            throw new Error(`Field ${capitalizeFirstLetter(nonEmptyTextFields[i])} shouldnt be empty if included inside the json`)
          }
        }
      }
      const numericFields = ['price', 'bathrooms']
      for (let x = 0; x < numericFields; x++) {
        const fieldValue = listingFormObject[numericFields[x]];
        if (fieldValue) {
          if (isNaN(Number(fieldValue))) {
            throw new Error(`Field ${capitalizeFirstLetter(numericFields[x])} shouldnt be a number if included inside the json`)
          }
        }
      }
      const requiredAddressFields = ['street', 'city', 'state', 'postcode', 'country']
      if (listingFormObject.address) {
        for (let i = 0; i < requiredAddressFields.length; i++) {
          const fieldValue = listingFormObject.address[requiredAddressFields[i]];
          if (fieldValue) {
            if (fieldValue.trim().length === 0) {
              throw new Error(`Field ${capitalizeFirstLetter(requiredAddressFields[i])} in address cannot be empty`)
            }
          } else {
            throw new Error(`Field ${capitalizeFirstLetter(requiredAddressFields[i])} is required in address`)
          }
        }
      }
      if (listingFormObject.bedrooms) {
        if (!Array.isArray(listingFormObject.bedrooms)) {
          throw new Error('Bedroom field must be an array')
        }
        for (let i = 0; i < listingFormObject.bedrooms.length; i++) {
          const bedroomObject = listingFormObject.bedrooms[i];
          if (!bedroomObject.type) {
            throw new Error('You must include type inside the bedroom object')
          }
          if (!bedroomObject.beds) {
            throw new Error('You must include beds inside the bedroom object')
          }
          if (isNaN(Number(bedroomObject.beds))) {
            throw new Error('beds inside the bedroom object must be a number')
          }
        }
      }

      if (listingFormObject.amenities) {
        if (!Array.isArray(listingFormObject.amenities)) {
          throw new Error('Amenities field must be an array')
        }
        for (let i = 0; i < listingFormObject.amenities.length; i++) {
          const amenity = listingFormObject.amenities[i];
          if (amenity.trim().length === 0) {
            throw new Error('Amenity inside the amenities array cannot be empty if included')
          }
        }
      }

      const emptyAddressObject = {
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      }

      const initialBedObject = {
        type: 'Private',
        beds: 1
      }

      const newListingObject = {
        title: listingFormObject.title ? listingFormObject.title : '',
        address: listingFormObject.address ? listingFormObject.address : emptyAddressObject,
        price: listingFormObject.price ? listingFormObject.price : 0,
        thumbnail: '',
        metadata: {
          bedrooms: listingFormObject.bedrooms ? listingFormObject.bedrooms : [initialBedObject],
          amenities: listingFormObject.amenities ? listingFormObject.amenities : [''],
          type: listingFormObject.type ? listingFormObject.type : 'Home',
          bathrooms: listingFormObject.bathrooms ? listingFormObject.bathrooms : 0,
          url: '',
          files: []
        }
      }
      setListings(newListingObject);
    } catch (error) {
      e.target.value = '';
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  return (
    <React.Fragment>
    <Dialog open={open} onClose={handleClose} aria-labelledby ='create-listing-dialog-title' maxWidth = 'sm' fullWidth scroll = 'paper' >
      <DialogTitle id='create-listing-dialog-title'>Create New Listing</DialogTitle>
      <ModalCloseButton handleClose={handleClose}/>
      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
          <Typography variant='subtitle1'>Upload data about a listing using JSON </Typography>
          <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
            Upload Json File
            <VisuallyHiddenInput type='file' onChange={handleFileInput} />
          </Button>
        </Box>
        <Box sx={{ width: '100%' }}>
          <ListingForm mode='Create' buttonSubmitFunction={createListingFunction} existingListingObject={listings}/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>
  )
}

export default CreateListingModal;
