import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../../components/ListingForm';
import { apiCall, listingObjectValidator } from '../../utils/utils';
import { StoreContext } from '../../utils/states';

/*
Edit Page Component for the Edit Listing page where the user will edit the detail of a specific listing that they hosted
*/
const EditListing = () => {
  const navigate = useNavigate()
  const { openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const { id } = useParams();
  const [listingObj, setListingObj] = useState({});

  /*
  Function that gets the listing detail using the id fetched from the url query params. Afterwards pass the listing
  to the ListingForm component through the listingObj state variable
  */
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

  /*
  useEffect that will call the getListingDetail function to get the details of the listing using the id from the url query param.
  */
  useEffect(() => {
    getListingDetail();
  }, [])

  /*
  Function that submit the changes made to the listing to the backend server, After a succesfull update, the function will navigate the user back to the hosted listing page
  This function will be passed to the ListingForm component as a prop
  */
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
