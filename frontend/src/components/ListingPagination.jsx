import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardActions, CardContent, CardMedia, Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListingCard from './ListingCard';
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

export default function ListingPagination ({ listingsArray }) {
  const navigate = useNavigate()
  const [listings, setListings] = useState([]);
  const [paginationObj, setPaginationObj] = useState({
    numberOfPage: 1,
    listingsArray: [],
    currentPage: 1
  })

  useEffect(() => {
    setPaginationObj({
      numberOfPage: Math.ceil(listingsArray.length / 20),
      listingsArray,
      currentPage: 1
    })
  }, [listingsArray])

  useEffect(() => {
    getPages(paginationObj.currentPage);
  }, [paginationObj])

  const getPages = (page) => {
    const sliceStartIndex = (page - 1) * 20;
    const sliceEndIndex = page === paginationObj.numberOfPage ? paginationObj.listingsArray.length : (page * 20)
    const dataToDisplay = paginationObj.listingsArray.slice(sliceStartIndex, sliceEndIndex);
    setListings(dataToDisplay);
  }

  const onChangeButton = (e, page) => {
    setPaginationObj({ ...paginationObj, currentPage: page })
  }
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 2 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12, lg: 12, xl: 10 }} sx={{ px: 2 }}>
          { listings.map((obj, index) => (
            <Grid item xs={1} sm={4} md={3} lg={3} xl={2} key={index}>
              <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  sx={{ height: 200 }}
                  image= {obj.thumbnail}
                  title="Thumbnail"
                />
                <CardContent>
                  <ListingCard listing={obj}/>
                </CardContent>
                <CardActions sx={{ mt: 'auto', alignSelf: 'flex-end' }}>
                  <Button size="small">Share</Button>
                  <Button size="small" onClick={() => navigate(`/hostedlisting/editlisting/${obj.id}`)}>Edit Listing</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
          }
        </Grid>
      </Box>
      <Pagination siblingCount={1} boundaryCount={1} count={paginationObj.numberOfPage} page={paginationObj.currentPage} variant="outlined" shape="rounded" size="medium" onChange={onChangeButton} sx={paginationStyling} />
  </React.Fragment>
  )
}
