import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../../components/ListingForm';
import { apiCall, listingObjectValidator } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

const EditListing = () => {
  const navigate = useNavigate()
  const { openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const { id } = useParams();
  const [listingObj, setListingObj] = useState({});
  const getListingDetail = async () => {
    try {
      const listingDetail = await apiCall(`listings/${id}`, 'GET');
      let listingData = listingDetail.data.listing;
      // If there is no amenities, Populate the amenities array with an empty string to initialize the dynamic form in ListingForm
      listingData = { ...listingData, metadata: { ...listingData.metadata, ...(listingData.metadata.amenities.length === 0 && { amenities: [''] }) } };
      setListingObj(listingData);
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
      openBackdrop[1](true);
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
          live: false,
          ...metadata
        }
      }
      await apiCall(`listings/${id}`, 'PUT', requestObject);
      modalHeader[1]('Success');
      modalMessage[1]('Sucessfully Edited Listing');
      openModal[1](true);
      setTimeout(() => {
        openModal[1](false);
        const userEmail = localStorage.getItem('userEmail');
        navigate(`/hostedlisting/${userEmail}`)
      }, 1000)
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    } finally {
      openBackdrop[1](false);
    }
  }

  return (
    <ListingForm mode='Edit' buttonSubmitFunction={handleSubmit} existingListingObject={listingObj}/>
  )
}

export default EditListing;
