import React, { useContext } from 'react';
import ListingForm from '../../components/ListingForm';
import { apiCall, listingObjectValidator } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

const CreateListing = () => {
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const handleSubmit = async (formObject, bedroomArray, amenities) => {
    try {
      formObject = { ...formObject, price: Number(formObject.price), bathrooms: Number(formObject.bathrooms) };
      bedroomArray = bedroomArray.map((e) => { return { type: e.type, beds: Number(e.beds) } });
      listingObjectValidator(formObject, bedroomArray, amenities);
      const { title, address, price, thumbnail, ...metadata } = formObject
      const requestObject = {
        title,
        address,
        price,
        thumbnail,
        metadata: {
          bedrooms: bedroomArray,
          amenities,
          live: false,
          ...metadata
        }
      }
      const request = await apiCall('listings/new', 'POST', requestObject);
      console.log(request);
      modalHeader[1]('Success');
      modalMessage[1]('Sucessfully Created Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  }

  return (
    <ListingForm mode='Create' buttonSubmitFunction={handleSubmit} existingListingObject={{}}/>
  )
}

export default CreateListing;