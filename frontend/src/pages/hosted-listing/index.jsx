import React from 'react';
import { Box, Typography, Grid, Card, CardActions, CardContent, CardMedia, Button, Pagination, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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
  const dummyData = [
    {
      name: 'test',
      image: 'https://dummyimage.com/1920x1080/000/fff'
    },
    {
      name: 'test',
      image: 'https://dummyimage.com/1280x700/000/fff'
    },
    {
      name: 'test',
      image: 'https://dummyimage.com/1280x700/000/fff'
    },
    {
      name: 'test',
      image: 'https://dummyimage.com/1280x700/000/fff'
    },
    {
      name: 'test',
      image: 'https://dummyimage.com/1280x700/000/fff'
    },
    {
      name: 'test',
      image: 'https://dummyimage.com/1280x700/000/fff'
    },
  ]

  const onChangeButton = (e, page) => {
    console.log(page);
    console.log(e)
  }
  return (
      <Box sx={{ height: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography align='center' variant= 'h4' sx={{ mt: 1 }}>
          My Hosted Listings
        </Typography>
        <Tooltip title="Add New Listings">
          <Fab color="primary" aria-label="Add Listing" sx={{ mx: 'auto' }}>
              <AddIcon/>
          </Fab>
        </Tooltip>
        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8, md: 12, lg: 12, xl: 10 }} sx={{ px: 2 }}>
            { dummyData.map((obj, index) => (
              <Grid item xs={1} sm={4} md={4} lg={3} xl={2} key={index}>
                <Card sx={{ maxWidth: '100%' }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    image= {obj.image}
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species, ranging across all continents except Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'right' }}>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
            }
          </Grid>
          <Pagination siblingCount={1} boundaryCount={1} count={10} variant="outlined" shape="rounded" size="medium" onChange={onChangeButton} sx={paginationStyling} />
        </Box>
      </Box>
  )
}
