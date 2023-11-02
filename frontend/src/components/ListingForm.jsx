import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, TextField, Container, Box, IconButton, Button } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MessageModal from './MessageModal'
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

export default function ListingForm ({ mode, buttonSubmitFunction, existingListingObject }) {
  const [formFields, setFormFields] = useState(
    {
      title: '',
      type: '',
      price: 0,
      address: '',
      bathrooms: 0,
      thumbnail: '',
      url: '',
      files: []
    })

  const [openModal, setOpenModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [bedroomField, setBedroomField] = useState([{ type: '', beds: 1 },]);
  const [amenitiesField, setAmenitiesField] = useState(['']);
  const thumbnailInputRef = useRef(null);
  const filesInputRef = useRef(null);
  const handleBasicInput = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    const existingFormFieldObject = {
      title: existingListingObject.title,
      type: existingListingObject.metadata.type,
      price: existingListingObject.price,
      address: existingListingObject.address,
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
    setBedroomField([...bedroomField, { type: '', beds: 1 }]);
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
      const requiredAmountOfFiles = type === 'thumbnail' ? 1 : 4;
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
      setFormFields({ ...formFields, files: previousFiles, thumbnail: previousThumbnail });
      setModalHeader('Error');
      setModalMessage(error.message);
      setOpenModal(true);
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              id='address'
              name='address'
              required
              label='Property Address'
              fullWidth
              variant='standard'
              value={formFields.address}
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
            <ImageCard key={null} image={formFields.thumbnail} sx={{ my: 1 }}/>
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
                Note: You can only upload up to 4 images at max
              </Typography>
            </Box>
            <ImageCarousel images={formFields.files}/>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button sx={{ float: 'right' }} variant='contained' onClick={(e) => { buttonSubmitFunction(formFields, bedroomField, amenitiesField, setOpenModal, setModalHeader, setModalMessage) }}>
              {mode} Listing
            </Button>
            {mode === 'edit' && (
              <Button sx={{ float: 'right', mr: 3, backgroundColor: '#002D62' }} variant='contained' >
                Reset Form
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
      <MessageModal header={modalHeader} content={modalMessage} open={openModal} setOpen={setOpenModal} ></MessageModal>
  </Container>
  )
}
