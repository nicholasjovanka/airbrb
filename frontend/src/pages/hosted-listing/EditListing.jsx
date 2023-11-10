import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingForm from '../../components/ListingForm';
import { apiCall, listingObjectValidator } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

const EditListing = () => {
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const { id } = useParams();
  const [listingObj, setListingObj] = useState({});
  const getListingDetail = async () => {
    try {
      const listingDetail = await apiCall(`listings/${id}`, 'GET');
      setListingObj(listingDetail.data.listing);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  }
  useEffect(() => {
    getListingDetail();
  }, [])
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
      const request = await apiCall(`listings/${id}`, 'PUT', requestObject);
      console.log(request);
      modalHeader[1]('Success');
      modalMessage[1]('Sucessfully Edited Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  }

  return (
    <ListingForm mode='Edit' buttonSubmitFunction={handleSubmit} existingListingObject={listingObj}/>
  )
}

export default EditListing;
