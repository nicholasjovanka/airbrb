import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActions, CardContent, CardMedia, Button, Pagination, Tooltip, Rating } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../../utils/utils';
import MessageModal from '../../components/MessageModal';
import AddIcon from '@mui/icons-material/Add';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';

const paginationStyling = {
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

export default function HostedListing () {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [listings, setListings] = useState([]);
  const [paginationObj, setPaginationObj] = useState({
    numberOfPage: 0,
    listingsArray: [],
    currentPage: 0
  })
  const { email } = useParams();
  useEffect(() => {
    const getListings = async () => {
      try {
        const listingsApiCall = await apiCall('listings', 'GET');
        const listingsArray = listingsApiCall.data.listings.filter((listing) => listing.owner === email);
        let listingsBelongingToOwner = []
        for (const listing of listingsArray) {
          const listingDetails = await apiCall(`listings/${listing.id}`, 'GET');
          listingsBelongingToOwner.push(listingDetails.data.listing);
        }
        listingsBelongingToOwner = listingsBelongingToOwner.map((listing) => {
          let numberOfBedrooms = 0;
          let averageRating = 0;
          listing.metadata.bedrooms.forEach((room) => {
            numberOfBedrooms += room.beds
          })

          listing.reviews.forEach((review) => {
            averageRating += review.rating
          })
          averageRating = listing.reviews.length > 0 ? (averageRating / listing.reviews.length).toFixed(2) : null
          return { ...listing, numberOfBedrooms, averageRating }
        })
        setPaginationObj({
          numberOfPage: Math.ceil(listingsBelongingToOwner.length / 10),
          listingsArray: listingsBelongingToOwner,
          currentPage: 1
        })
      } catch (error) {
        setModalHeader('Error');
        setModalMessage(error.message)
      }
    }

    getListings();
  }, [])

  useEffect(() => {
    getPages(paginationObj.currentPage);
  }, [paginationObj.currentPage])

  const getPages = (page) => {
    const sliceStartIndex = (page - 1) * 10;
    const sliceEndIndex = page === paginationObj.numberOfPage ? paginationObj.listingsArray.length : (page * 10)
    const dataToDisplay = paginationObj.listingsArray.slice(sliceStartIndex, sliceEndIndex);
    setListings(dataToDisplay);
  }

  const onChangeButton = (e, page) => {
    setPaginationObj({ ...paginationObj, currentPage: page })
  }
  return (
      <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          My Hosted Listings
        </Typography>
        <Tooltip title="Add New Listings">
          <Button variant="contained" endIcon={<AddIcon />} aria-label="Add Listing" sx={{ mx: 'auto' }} onClick={() => navigate('/hostedlisting/createListing')}>
            Create Listing
          </Button>
        </Tooltip>
        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12, lg: 12, xl: 10 }} sx={{ px: 2 }}>
            { listings.map((obj, index) => (
              <Grid item xs={1} sm={4} md={4} lg={3} xl={2} key={index}>
                <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    image= {obj.thumbnail}
                    title="Thumbnail"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {obj.title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      Type: {obj.metadata.type}
                    </Typography>
                    <Grid container spacing={{ xs: 1 }} justifyContent="space-between">
                      <Grid item xs={2}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                          {obj.numberOfBedrooms} <BedIcon sx={{ ml: 1 }}/>
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                          {obj.metadata.bathrooms} <BathtubIcon sx={{ ml: 1 }}/>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="h6" component="div" align='right'>
                          {obj.price} AUD/Night
                        </Typography>
                      </Grid>
                    </Grid>
                    {obj.averageRating != null && (<React.Fragment>
                    <Typography component="legend">Average Rating</Typography>
                    <Rating
                    name="simple-controlled"
                    value={Number(obj.averageRating)}
                    readOnly
                    />
                    </React.Fragment>)}
                    {obj.reviews.length > 0
                      ? <Typography gutterBottom variant="h6" component="div" align='right'>
                          {obj.reviews.length} Reviews
                        </Typography>
                      : <Typography gutterBottom variant="h6" component="div" align='left'>
                          No Reviews
                        </Typography>
                    }
                  </CardContent>
                  <CardActions sx={{ mt: 'auto', alignSelf: 'flex-end' }}>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
            }
          </Grid>
        </Box>
        <Pagination siblingCount={1} boundaryCount={1} count={paginationObj.numberOfPage} variant="outlined" shape="rounded" size="medium" onChange={onChangeButton} sx={paginationStyling} />
        <MessageModal header={modalHeader} content={modalMessage} open={openModal} setOpen={setOpenModal} ></MessageModal>
      </Box>
  )
}
