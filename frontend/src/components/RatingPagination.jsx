import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Pagination, Typography, Rating } from '@mui/material';
// import { apiCall, getId, capitalizeFirstLetter } from '../utils/utils';
import { basePaginationStyling } from '../utils/styles';

const ReviewPagination = ({ ratingArray, setRatingArray }) => {
  const [slicedRatings, setSlicedRatings] = useState([]);
  const [paginationObj, setPaginationObj] = useState({
    numberOfPage: 1,
    ratingArray: [],
    currentPage: 1
  })
  useEffect(() => {
    setPaginationObj({
      numberOfPage: Math.ceil(ratingArray.length / 6),
      ratingArray,
      currentPage: 1
    })
  }, [ratingArray])

  useEffect(() => {
    getPages(paginationObj.currentPage);
  }, [paginationObj])

  const getPages = (page) => {
    const sliceStartIndex = (page - 1) * 6;
    const sliceEndIndex = page === paginationObj.numberOfPage ? paginationObj.ratingArray.length : (page * 6)
    const dataToDisplay = paginationObj.ratingArray.slice(sliceStartIndex, sliceEndIndex);
    setSlicedRatings(dataToDisplay);
  }

  const onChangeButton = (e, page) => {
    setPaginationObj({ ...paginationObj, currentPage: page })
  }
  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column', gap: 2, px: 1, mb: 2 }}>
          {ratingArray.length === 0 && <Typography variant='h6' sx={{ mx: 'auto' }}> No Review Found For this Listing </Typography>}
          {ratingArray.length > 0 && slicedRatings.map((review, index) => (
            <Box key={index} sx={{ position: 'relative', width: '100%' }}>
              <Card sx={{ maxWidth: 'md', height: '100%', display: 'flex', flexDirection: 'column', p: 1 }} variant='outlined'>
                <CardContent sx={{ pt: 0, mt: 1, px: 0, position: 'relative' }}>
                    <Typography gutterBottom variant='h6' component='div'>
                        {review.user}
                    </Typography>
                    <Typography gutterBottom variant='subtitle1' component='div' color='text.secondary'>
                        Posted On: {review.postedOn}
                    </Typography>
                    <Rating name='read-only' value={review.rating} readOnly sx={{ display: 'flex', my: 1 }}/>
                    <Typography variant='body1'>
                        {review.comment.length > 0 ? review.comment : 'No Comment'}
                    </Typography>
                </CardContent>
              </Card>
            </Box>
          ))
          }

      </Box>
      <Pagination siblingCount={1} boundaryCount={1} count={paginationObj.numberOfPage} page={paginationObj.currentPage} variant='outlined' shape='rounded' size='medium' onChange={onChangeButton} sx={basePaginationStyling} />
  </React.Fragment>
  )
}

export default ReviewPagination
