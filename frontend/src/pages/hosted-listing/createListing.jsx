import React, { useContext } from 'react';
import ListingForm from '../../components/ListingForm';
import { apiCall } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

export default function CreateListing () {
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const handleSubmit = async (formObject, bedroomArray, amenities) => {
    try {
      const nonEmptyTextFields = ['title', 'type', 'price', 'address', 'thumbnail']
      for (const textFields of nonEmptyTextFields) {
        if (formObject[nonEmptyTextFields] === '' || formObject[nonEmptyTextFields] === null) {
          throw new Error(`${textFields} cannot be empty`)
        }
      }
      if (formObject.files.length < 1) {
        throw new Error('You must atleast upload 1 property image')
      }
      if (formObject.price <= 0) {
        throw new Error('Price must be above 0')
      }
      if (formObject.bathrooms < 0) {
        throw new Error('Number of Bathroom cannot be below 0')
      }
      if (formObject.url !== '') {
        const regex = /^(https?:\/\/)?((www.)?youtube.com|youtu.be)\/.+$/i;
        if (!regex.test(formObject.url)) {
          throw new Error('Invalid Youtube URL')
        }
      }
      bedroomArray.forEach(element => {
        if (element.beds < 0) {
          throw new Error('Number of Beds cannot be below 0')
        }
      });
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
