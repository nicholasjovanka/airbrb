import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ModalCloseButton from './ModalCloseButton';
import RatingPagination from './RatingPagination';
const RatingModal = ({ open, setOpen, propRatingObj }) => {
  const [ratingObj, setRatingObj] = useState({})
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setRatingObj(propRatingObj)
  }, [propRatingObj])

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby ='rating-dialog-title' maxWidth = 'sm' fullWidth scroll = 'paper' >
        <DialogTitle id='rating-dialog-title'>{ratingObj.ratingFilter} Star Ratings for {ratingObj.listingName}</DialogTitle>
        <ModalCloseButton handleClose={handleClose}/>
        <DialogContent>
         <RatingPagination ratingArray={ratingObj.ratings}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default RatingModal;
