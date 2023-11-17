import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ModalCloseButton from './ModalCloseButton';
import RatingPagination from './RatingPagination';

/*
Modal Component used to allow the user to paginate the ratings that is within a specific rating category.

Props Explanation;
- open: boolean state variable passed from the parent that dictates when to open the Rating modal
- setOpen: The state set function for the 'open' boolean state that allows the modal to close when the close button is clicked
*/
const RatingModal = ({ open, setOpen, propRatingObj }) => {
  const [ratingObj, setRatingObj] = useState({});
  /*
  Function that allows the close button of the modal to close the modal
  */
  const handleClose = () => {
    setOpen(false);
  };

  /*
  useEffect to detect changes to the passed prop which in turn will update the Modal title along with the ratings array passed to the rating pagination component
  */
  useEffect(() => {
    setRatingObj(propRatingObj);
  }, [propRatingObj]);

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
