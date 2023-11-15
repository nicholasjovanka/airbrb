import React, { useState, useRef, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, TextField, Container, Box, IconButton, Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { StoreContext } from '../utils/states';
import { fileToDataUrl } from '../utils/utils';
import ImageCarousel from './ImageCarousel';
import ImageCard from './ImageCard';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ListingForm = ({ mode, buttonSubmitFunction, existingListingObject }) => {
  const [formFields, setFormFields] = useState(
    {
      title: '',
      type: 'Home',
      price: 0,
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      bathrooms: 0,
      thumbnail: '',
      url: '',
      files: []
    })
  const { openModal, modalHeader, modalMessage } = useContext(StoreContext);

  const [bedroomField, setBedroomField] = useState([{ type: 'Private', beds: 1 },]);
  const [amenitiesField, setAmenitiesField] = useState(['']);
  const thumbnailInputRef = useRef(null);
  const filesInputRef = useRef(null);
  const handleBasicInput = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    if (Object.keys(existingListingObject).length > 0) {
      const existingFormFieldObject = {
        title: existingListingObject.title,
        type: existingListingObject.metadata.type,
        price: existingListingObject.price,
        street: existingListingObject.address.street,
        city: existingListingObject.address.city,
        state: existingListingObject.address.state,
        postcode: existingListingObject.address.postcode,
        country: existingListingObject.address.country,
        bathrooms: Number(existingListingObject.metadata.bathrooms),
        thumbnail: existingListingObject.thumbnail,
        url: existingListingObject.metadata.url,
        files: existingListingObject.metadata.files
      }
      const existingBedrooms = existingListingObject.metadata.bedrooms.length > 0 ? existingListingObject.metadata.bedrooms : []
      const exitingAmenities = existingListingObject.metadata.amenities.length > 0 ? existingListingObject.metadata.amenities : []

      setFormFields(existingFormFieldObject);
      setBedroomField([...existingBedrooms]);
      setAmenitiesField([...exitingAmenities]);
    }
  }

  useEffect(() => {
    if (mode === 'Edit') {
      resetForm();
    }
  }, [existingListingObject])

  const handleAddAmenities = () => {
    setAmenitiesField([...amenitiesField, '']);
  };

  const handleAmenitiesInput = (index, event) => {
    const values = [...amenitiesField];
    values[index] = event.target.value;
    setAmenitiesField(values);
  };

  const handleRemoveAmenities = (index) => {
    const values = [...amenitiesField];
    values.splice(index, 1);
    setAmenitiesField(values);
  };

  const handleAddBedroom = () => {
    setBedroomField([...bedroomField, { type: 'Private', beds: 1 }]);
  };

  const handleBedroomInput = (index, event) => {
    const values = [...bedroomField];
    values[index][event.target.name] = event.target.value;
    setBedroomField(values);
  };

  const handleRemoveBedroom = (index) => {
    const values = [...bedroomField];
    values.splice(index, 1);
    setBedroomField(values);
  };

  const handleFileInput = async (type = 'thumbnail', e) => {
    const files = e.target.files;
    const previousThumbnail = formFields.thumbnail;
    const previousFiles = formFields.files;
    const newFileNameArray = [];
    const filesBase64 = [];
    try {
      if (type === 'files') {
        setFormFields({ ...formFields, files: [] });
      }
      const requiredAmountOfFiles = type === 'thumbnail' ? 1 : 6;
      if (files.length > requiredAmountOfFiles) {
        throw new Error(`Amount of files exceeded for ${type}, only ${requiredAmountOfFiles} image is needed`)
      }
      for (const file of files) {
        const fileBase64 = await fileToDataUrl(file);
        if (type === 'thumbnail') {
          setFormFields({ ...formFields, thumbnail: fileBase64 });
        } else {
          newFileNameArray.push(file.name)
          filesBase64.push(fileBase64)
        }
      }
      if (type === 'files') {
        setFormFields({ ...formFields, files: filesBase64 });
      }
    } catch (error) {
      e.target.value = '';
      console.log(openModal);
      setFormFields({ ...formFields, files: previousFiles, thumbnail: previousThumbnail });
      modalHeader[1]('Error');
      modalMessage[1](error.message);
      openModal[1](true);
    }
  }

  const resetThumbnail = () => {
    const initialThumbnail = mode === 'Edit' ? existingListingObject.thumbnail : '';
    setFormFields({ ...formFields, thumbnail: initialThumbnail });
    thumbnailInputRef.current.value = ''
  }

  const resetImages = () => {
    const initialImages = mode === 'Edit' ? existingListingObject.metadata.files : [];
    setFormFields({ ...formFields, files: initialImages });
    filesInputRef.current.value = ''
  }

  return (
    <Container maxWidth ='sm'>
      <Box sx = {{ boxShadow: 3, my: 1, px: 2, py: 1 }}>
        <Typography variant='h6' gutterBottom>
          {mode} Listing
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id='title'
              name='title'
              label='Listing Name'
              fullWidth
              variant='standard'
              value={formFields.title}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id='type'
              name='type'
              label='Property Type'
              fullWidth
              variant='standard'
              value={formFields.type}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id='price'
              name='price'
              label='Price Per Night'
              fullWidth
              type= 'number'
              variant='standard'
              value={formFields.price}
              onChange={handleBasicInput}
              InputProps = {
                {
                  endAdornment: (
                    <InputAdornment position='end'>
                     AUD
                    </InputAdornment>
                  )
                }
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='url'
              name='url'
              label='Showcase Youtube URL'
              fullWidth
              type= 'url'
              variant='standard'
              onChange={handleBasicInput}
              value={formFields.url}
              InputProps = {
                {
                  endAdornment: (
                    <InputAdornment position='end'>
                     <YouTubeIcon></YouTubeIcon>
                    </InputAdornment>
                  )
                }
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id='bathrooms'
              name='bathrooms'
              label='Number of Bathrooms'
              fullWidth
              type= 'number'
              variant='standard'
              value={formFields.bathrooms}
              onChange={handleBasicInput}
              InputProps = {
                {
                  endAdornment: (
                    <InputAdornment position='end'>
                     <BathtubIcon></BathtubIcon>
                    </InputAdornment>
                  )
                }
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='street'
              name='street'
              required
              label='Street'
              fullWidth
              variant='standard'
              value={formFields.street}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='city'
              name='city'
              required
              label='City'
              fullWidth
              variant='standard'
              value={formFields.city}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='state'
              name='state'
              required
              label='State'
              fullWidth
              variant='standard'
              value={formFields.state}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='postcode'
              name='postcode'
              required
              label='Postcode'
              fullWidth
              variant='standard'
              value={formFields.postcode}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='country'
              name='country'
              required
              label='Country'
              fullWidth
              variant='standard'
              value={formFields.country}
              onChange={handleBasicInput}
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant='subtitle1' sx={{ width: 1 }}>
                  Bedrooms
              </Typography>
              {bedroomField.map((bedroomObj, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: index === (bedroomField.length - 1) ? 0 : 2 }}>
                  <TextField
                    name='type'
                    label='Bedroom Type'
                    variant='standard'
                    value={bedroomObj.type}
                    onChange={(event) => handleBedroomInput(index, event)}
                  />
                  <TextField
                    name='beds'
                    label='Number of Beds'
                    variant='standard'
                    value={bedroomObj.beds}
                    type='number'
                    onChange={(event) => handleBedroomInput(index, event)}
                    InputProps = {
                      {
                        endAdornment: (
                          <InputAdornment position='end'>
                           <BedIcon></BedIcon>
                          </InputAdornment>
                        )
                      }
                    }
                  />
                  <IconButton onClick={() => handleRemoveBedroom(index)} disabled = {index === 0}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAddBedroom()}>
                    <AddIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant='subtitle1' sx={{ width: 1 }}>
                  Amenities
              </Typography>
              {amenitiesField.map((amenities, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: index === (amenitiesField.length - 1) ? 0 : 2 }}>
                  <TextField
                    name='amenities'
                    label='Amenities'
                    variant='standard'
                    value={amenities}
                    fullWidth
                    onChange={(event) => handleAmenitiesInput(index, event)}
                  />
                  <IconButton onClick={() => handleRemoveAmenities(index)} disabled = {index === 0}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAddAmenities()}>
                    <AddIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant='subtitle1' sx={{ width: 1 }}>
                Thumbnail:
              </Typography>
              <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput type='file' onChange={(e) => { handleFileInput('thumbnail', e) }} ref={thumbnailInputRef} />
              </Button>
              <Button variant='contained' color="secondary" onClick={(e) => { resetThumbnail() }}>
                Reset Image
              </Button>
            </Box>
            <ImageCard key={null} src={formFields.thumbnail} sx={{ my: 1 }}/>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant='subtitle1' sx={{ width: 1 }}>
                Property Images:
              </Typography>
              <Button component='label' variant='contained' startIcon={<CloudUploadIcon />} aria-describedby='hosting-images-description'>
                Upload file
                <VisuallyHiddenInput type='file' multiple onChange={(e) => { handleFileInput('files', e) }} ref={filesInputRef}/>
              </Button>
              <Button variant='contained' color="secondary" onClick={(e) => { resetImages() }}>
                Reset Image
              </Button>
              <Typography id='hosting-images-description' variant='caption' sx={{ width: 1 }}>
                Note: You can only upload up to 6 images at max
              </Typography>
            </Box>
            <ImageCarousel images={formFields.files}/>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button sx={{ float: 'right' }} variant='contained' onClick={(e) => { buttonSubmitFunction(formFields, bedroomField, amenitiesField) }}>
              {mode} Listing
            </Button>
            {mode === 'Edit' && (
              <Button sx={{ float: 'right', mr: 3, backgroundColor: '#002D62' }} variant='contained' onClick={resetForm} >
                Reset Form
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
  </Container>
  )
}

export default ListingForm;
