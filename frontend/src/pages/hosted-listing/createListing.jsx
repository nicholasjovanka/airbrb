import React from 'react';
import ListingForm from '../../components/ListingForm';
import { apiCall } from '../../utils/utils';

export default function CreateListing () {
  const handleSubmit = async (formObject, bedroomArray, amenities, setOpenModal, setModalHeader, setModalMessage) => {
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
      setModalHeader('Success');
      setModalMessage('Sucessfully Created Listing');
      setOpenModal(true);
    } catch (error) {
      setModalHeader('Error');
      const errorMessage = error.response.data.error ? error.response.data.error : error.message;
      setModalMessage(errorMessage);
      setOpenModal(true);
    }
  }

  return (
    <ListingForm mode='Create' buttonSubmitFunction={handleSubmit} existingListingObject={{}}/>
  )
}
