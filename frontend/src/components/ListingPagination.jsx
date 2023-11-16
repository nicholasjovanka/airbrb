import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card, CardActions, CardContent, CardMedia, Button, Pagination, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, getId, capitalizeFirstLetter, getLuxonDayDifference } from '../utils/utils';
import { StoreContext } from '../utils/states';
import ListingCard from './ListingCard';
import ConfirmationModal from './ConfirmationModal';
import DatePickerModal from './DatePickerModal';
import { basePaginationStyling } from '../utils/styles';
import RatingModal from './RatingModal';
const paginationStyling = {
  ...basePaginationStyling,
  position: 'sticky',
  bottom: 0,
}

const ListingPagination = ({ listingsArray, displayPage, dateFilterOn = false, startDate, endDate }) => {
  const navigate = useNavigate()
  const [slicedListings, setSlicedListings] = useState([]); //
  const [selectedListing, setSelectedListing] = useState({
    id: '',
    index: 0,
  });
  const { openModal, modalHeader, modalMessage, openBackdrop } = useContext(StoreContext);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);
  const [openUnpublishConfirmationModal, setOpenUnpublishConfirmationModal] = useState(false);
  const [confirmationModalContent, setConfirmationModalContent] = useState('');
  const [openDatePickerModal, setOpenDatePickerModal] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [ratingsModalObj, setRatingsModalObj] = useState({});
  const [paginationObj, setPaginationObj] = useState({
    numberOfPage: 1,
    listingsArray: [],
    currentPage: 1
  })
  useEffect(() => {
    setPaginationObj({
      ...paginationObj,
      numberOfPage: Math.ceil(listingsArray.length / 12),
      listingsArray
    })
  }, [listingsArray])

  useEffect(() => {
    getPages(paginationObj.currentPage);
  }, [paginationObj])

  const openDeleteModal = (id, index) => {
    setSelectedListing({
      id,
      index: (paginationObj.currentPage - 1) * 12 + index
    })
    setConfirmationModalContent('Are you sure you want to delete this listing');
    setOpenDeleteConfirmationModal(true);
  }

  const openPublishModal = (id, index) => {
    setSelectedListing({
      id,
      index: (paginationObj.currentPage - 1) * 12 + index
    })
    setOpenDatePickerModal(true)
  }

  const openUnpublishModal = (id, index) => {
    setSelectedListing({
      id,
      index: (paginationObj.currentPage - 1) * 12 + index
    });
    setConfirmationModalContent('Are you sure you want to unpublish this listing');
    setOpenUnpublishConfirmationModal(true);
  }

  const openRatingModalFunction = (listingRatingArray, listingName, ratingFilter) => {
    const ratingsToDisplay = listingRatingArray.filter((rating) => rating.rating === ratingFilter);
    setRatingsModalObj({
      ratings: ratingsToDisplay,
      ratingFilter,
      listingName
    })
    setOpenRatingModal(true);
  }

  const makeListingGoLive = async (datearray) => {
    try {
      for (let y = 0; y < datearray.length; y++) {
        const currentStartDate = datearray[y].startDate;
        const currentEndDate = datearray[y].endDate;
        const dayDifference = getLuxonDayDifference(currentStartDate, currentEndDate);
        if (dayDifference <= 0) {
          throw new Error('Booking Start Date must be less than Booking End date')
        }
      }
      for (let i = 0; i < datearray.length; i++) {
        for (let z = i + 1; z < datearray.length; z++) {
          const startDateDifference = getLuxonDayDifference(datearray[z].startDate, datearray[i].startDate);
          const firstDateStartDateString = datearray[i].startDate.setLocale('en-gb').toLocaleString();
          const firstDateEndDateString = datearray[i].endDate.setLocale('en-gb').toLocaleString();
          const secondDateStartDateString = datearray[z].startDate.setLocale('en-gb').toLocaleString();
          const secondDateEndDateString = datearray[z].endDate.setLocale('en-gb').toLocaleString();
          if (startDateDifference === 0) {
            throw new Error(`The date ${firstDateStartDateString} - ${firstDateEndDateString} has the same start date with  ${secondDateStartDateString} - ${secondDateEndDateString} `);
          } else if (startDateDifference < 0) {
            if (getLuxonDayDifference(datearray[z].startDate, datearray[i].endDate) >= 0) {
              throw new Error(`The date ${firstDateStartDateString} - ${firstDateEndDateString} end date must be smaller than the start date of ${secondDateStartDateString} - ${secondDateEndDateString} `);
            }
          } else if (startDateDifference > 0) {
            if (getLuxonDayDifference(datearray[i].startDate, datearray[z].endDate) >= 0) {
              throw new Error(`The date ${secondDateStartDateString} - ${secondDateEndDateString} end date must be smaller than the start date of ${firstDateStartDateString} - ${firstDateEndDateString} `);
            }
          }
        }
      }
      const dateArrayToBeSubmitted = datearray.map((dateObj) => {
        return {
          startDate: dateObj.startDate.toISODate(),
          endDate: dateObj.endDate.toISODate()
        }
      })
      await apiCall(`listings/publish/${selectedListing.id}`, 'PUT', { availability: dateArrayToBeSubmitted });
      const modifiedListing = [...paginationObj.listingsArray];
      modifiedListing[selectedListing.index].availability = dateArrayToBeSubmitted;
      setPaginationObj({ ...paginationObj, listingsArray: modifiedListing })
      setOpenDatePickerModal(false);
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Published Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  const unpublishListing = async () => {
    try {
      setOpenUnpublishConfirmationModal(false);
      await apiCall(`listings/unpublish/${selectedListing.id}`, 'PUT', {});
      const modifiedListing = [...paginationObj.listingsArray];
      modifiedListing[selectedListing.index].availability = [];
      setPaginationObj({ ...paginationObj, listingsArray: modifiedListing });
      setOpenDatePickerModal(false);
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Unpublished Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  const deleteListing = async () => {
    try {
      await apiCall(`listings/${selectedListing.id}`, 'DELETE');
      setOpenDeleteConfirmationModal(false);
      const previousListingArray = [...paginationObj.listingsArray];
      previousListingArray.splice(selectedListing.index, 1);
      const newNumberOfPage = Math.ceil(previousListingArray.length / 12);
      const pageToGoTo = paginationObj.currentPage > newNumberOfPage ? newNumberOfPage : paginationObj.currentPage;
      setPaginationObj({
        numberOfPage: newNumberOfPage,
        listingsArray: previousListingArray,
        currentPage: pageToGoTo
      })
      modalHeader[1]('Success');
      modalMessage[1]('Succesfully Deleted Listing');
      openModal[1](true);
    } catch (error) {
      modalHeader[1]('Error');
      const errorMessage = error.response ? error.response.data.error : error.message;
      modalMessage[1](errorMessage);
      openModal[1](true);
    }
  }

  const getPages = (page) => {
    const sliceStartIndex = (page - 1) * 12;
    const sliceEndIndex = page === paginationObj.numberOfPage ? paginationObj.listingsArray.length : (page * 12)
    const dataToDisplay = paginationObj.listingsArray.slice(sliceStartIndex, sliceEndIndex);
    setSlicedListings(dataToDisplay);
  }

  const navigateToListing = (id) => {
    navigate(`/listing/${id}${dateFilterOn ? `?startDate=${startDate.toISODate()}&endDate=${endDate.toISODate()}` : ''}`)
  }

  const onChangeButton = (e, page) => {
    setPaginationObj({ ...paginationObj, currentPage: page })
  }
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 2 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12, lg: 12, xl: 18 }} sx={{ px: 2 }}>
          { (slicedListings.length === 0 && !openBackdrop[0]) && (
          <Typography sx={{ mx: 'auto', my: 3 }} textAlign='center' variant='h1'>
            No Listings Found
          </Typography>)}
          { slicedListings.length > 0 && slicedListings.map((obj, index) => (
            <Grid item xs={1} sm={4} md={4} lg={3} xl={3} key={index} sx={{ position: 'relative' }}>
              <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  sx={{ height: 200, position: 'relative' }}
                  component={obj.metadata.url !== '' ? 'iframe' : 'img'}
                  src= {obj.metadata.url !== '' ? `https://www.youtube.com/embed/${getId(obj.metadata.url)}` : obj.thumbnail}
                  title="Thumbnail"
                  controls
                >
                </CardMedia>
                <CardContent sx={{ pt: 0, mt: 1, px: 0, position: 'relative' }}>
                { obj.status && (
                    <Box sx={{ position: 'relative', top: 0, width: 1, mt: '-11%', mb: '0%' }}>
                    <Typography align='center' variant= 'h6' sx={{ mt: 0, width: 1, backgroundColor: '#888888', mx: 'auto' }}>
                      {capitalizeFirstLetter(obj.status)}
                    </Typography>
                    </Box>
                )}
                  <ListingCard listing={obj} displayPage={displayPage} openRatingModalFunction={openRatingModalFunction} navigateToListing={() => { navigateToListing(obj.id) }}/>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  { displayPage === 'hostedlisting' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                        <Button variant='outlined' size="small" onClick={() => navigate(`/hostedlisting/editlisting/${obj.id}`)}>Edit Listing</Button>
                        <Button variant='outlined' size="small" color='error'onClick={() => openDeleteModal(obj.id, index)} >Delete Listing</Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mx: 0, justifyContent: 'start' }}>
                          {obj.availability.length === 0 && (<Button variant='outlined' size="small" onClick={() => openPublishModal(obj.id, index) } >Go Live</Button>)}
                          {obj.availability.length > 0 && (<Button variant='outlined' size="small" color='error' onClick={() => openUnpublishModal(obj.id, index) } >Unpublish</Button>)}
                          <Button variant='outlined' size="small" onClick={() => navigate(`/hostedlisting/managebookings/${obj.id}`)}>Manage Bookings</Button>
                      </Box>
                    </Box>
                  )}
                  { displayPage === 'home' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                        <Button variant='outlined' size="small" onClick={() => navigateToListing(obj.id)}>View Listing Details</Button>
                      </Box>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
          }
        </Grid>
      </Box>
      <Pagination siblingCount={1} boundaryCount={1} count={paginationObj.numberOfPage} page={paginationObj.currentPage} variant="outlined" shape="rounded" size="medium" onChange={onChangeButton} sx={paginationStyling} />
       <ConfirmationModal
        content={confirmationModalContent}
        open={openDeleteConfirmationModal}
        setOpen={setOpenDeleteConfirmationModal}
        confirmFunction={deleteListing}
        />
        <ConfirmationModal
        content={confirmationModalContent}
        open={openUnpublishConfirmationModal}
        setOpen={setOpenUnpublishConfirmationModal}
        confirmFunction={unpublishListing}
        />
        <RatingModal open={openRatingModal} setOpen={setOpenRatingModal} propRatingObj={ratingsModalObj}/>
      <DatePickerModal open={openDatePickerModal} setOpen={setOpenDatePickerModal} goLiveFunction={makeListingGoLive}/>
  </React.Fragment>
  )
}

export default ListingPagination
