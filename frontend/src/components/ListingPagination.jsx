import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card, CardActions, CardContent, CardMedia, Button, Pagination, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/utils';
import { StoreContext } from '../utils/states';
import ListingCard from './ListingCard';
import ConfirmationModal from './ConfirmationModal';
import DatePickerModal from './DatePickerModal';
export const paginationStyling = {
  display: 'flex',
  justifyContent: 'center',
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'white',
  border: 1,
  borderColor: 'black',
  width: '100%',
  p: 1
}

export default function ListingPagination ({ listingsArray, page, loggedIn }) {
  const navigate = useNavigate()
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState({
    id: '',
    index: 0,
  });
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false);
  const [confirmationModalContent, setConfirmationModalContent] = React.useState('');
  const [openDatePickerModal, setOpenDatePickerModal] = React.useState(false);
  const [paginationObj, setPaginationObj] = useState({
    numberOfPage: 1,
    listingsArray: [],
    currentPage: 1
  })
  useEffect(() => {
    setPaginationObj({
      numberOfPage: Math.ceil(listingsArray.length / 12),
      listingsArray,
      currentPage: 1
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
    setOpenConfirmationModal(true);
  }

  const openPublishModal = (id, index) => {
    setSelectedListing({
      id,
      index: (paginationObj.currentPage - 1) * 12 + index
    })
    setOpenDatePickerModal(true)
  }

  const makeListingGoLive = async (datearray) => {
    try {
      for (let i = 0; i < datearray.length; i++) {
        for (let z = i + 1; z < datearray.length; z++) {
          const startDateDifference = Math.ceil(datearray[i].startdate.diff(datearray[z].startdate, ['days']).toObject().days)
          const firstDateStartDateString = datearray[i].startdate.setLocale('en-gb').toLocaleString();
          const firstDateEndDateString = datearray[i].enddate.setLocale('en-gb').toLocaleString();
          const secondDateStartDateString = datearray[z].startdate.setLocale('en-gb').toLocaleString();
          const secondDateEndDateString = datearray[z].enddate.setLocale('en-gb').toLocaleString();
          // console.log(datearray[i].startdate.toISODate());
          if (startDateDifference === 0) {
            throw new Error(`The date ${firstDateStartDateString} - ${firstDateEndDateString} has the same start date with  ${secondDateStartDateString} - ${secondDateEndDateString} `);
          } else if (startDateDifference < 0) {
            if (datearray[i].enddate.diff(datearray[z].startdate, ['days']).toObject().days >= 0) {
              throw new Error(`The date ${firstDateStartDateString} - ${firstDateEndDateString} end date must be smaller than the start date of ${secondDateStartDateString} - ${secondDateEndDateString} `);
            }
          } else if (startDateDifference > 0) {
            if (datearray[z].enddate.diff(datearray[i].startdate, ['days']).toObject().days >= 0) {
              throw new Error(`The date ${secondDateStartDateString} - ${secondDateEndDateString} end date must be smaller than the start date of ${firstDateStartDateString} - ${firstDateEndDateString} `);
            }
          }
        }
      }
      const dateArrayToBeSubmitted = datearray.map((dateObj) => {
        return {
          startdate: dateObj.startdate.toISODate(),
          enddate: dateObj.enddate.toISODate()
        }
      })
      await apiCall(`listings/publish/${selectedListing.id}`, 'PUT', { availability: dateArrayToBeSubmitted });
      const modifiedListing = paginationObj.listingsArray;
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

  const deleteListing = async () => {
    try {
      await apiCall(`listings/${selectedListing.id}`, 'DELETE');
      setOpenConfirmationModal(false);
      const previousListingArray = paginationObj.listingsArray;
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
    setListings(dataToDisplay);
  }

  const onChangeButton = (e, page) => {
    setPaginationObj({ ...paginationObj, currentPage: page })
  }
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 2 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12, lg: 12, xl: 18 }} sx={{ px: 2 }}>
          { listings.map((obj, index) => (
            <Grid item xs={1} sm={4} md={4} lg={3} xl={3} key={index} sx={{ position: 'relative' }}>
              <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  sx={{ height: 200, position: 'relative' }}
                  image= {obj.thumbnail}
                  title="Thumbnail"
                >
                { index === 1 && (
                    <Box sx={{ position: 'absolute', bottom: 0, width: 1 }}>
                    <Typography align='center' variant= 'h6' sx={{ mt: 0, width: 1, backgroundColor: '#888888', mx: 'auto' }}>
                      Available
                    </Typography>
                    </Box>
                )}
                </CardMedia>
                <CardContent sx={{ pt: 0, mt: 1 }}>
                  <ListingCard listing={obj}/>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  { page === 'hostedlisting' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                        <Button variant='outlined' size="small" onClick={() => navigate(`/hostedlisting/editlisting/${obj.id}`)}>Edit Listing</Button>
                        <Button variant='outlined' size="small" color='error'onClick={() => openDeleteModal(obj.id, index)} >Delete Listing</Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mx: 0, justifyContent: 'start' }}>
                          <Button variant='outlined' size="small" onClick={() => openPublishModal(obj.id, index) } >{obj.availability.length > 0 ? 'Unpublish' : 'Go Live' }</Button>
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
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        confirmFunction={deleteListing}
        />
      <DatePickerModal open={openDatePickerModal} setOpen={setOpenDatePickerModal} goLiveFunction={makeListingGoLive}/>
  </React.Fragment>
  )
}
