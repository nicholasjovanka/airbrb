import axios from 'axios'
import { BACKEND_PORT } from '../config.js';
import { DateTime } from 'luxon';

export const fileToDataUrl = (file) => {
  if (file === null) { // Checks if the passed file is null, if it is null then return nothing
    return new Promise((resolve, reject) => {
      resolve(null);
    })
  } else { // If the file is not null then process it and return the file reader as a promise
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  }
}

export const checkEmail = (email) => {
  const regexp = /^(([^<>()\\[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email.trim());
}

export const apiCall = (url, method, body = {}, queryString = null) => {
  const path = `http://localhost:${BACKEND_PORT}/${url}${queryString !== null ? `?${queryString}` : ''}`; // Build the URL String or in this case the api route
  const token = localStorage.getItem('token'); // Get the user authorization token from the local storage
  const config = {
    ...(token !== null && { headers: { Authorization: `Bearer ${token}` } })
  };
  if (method === 'POST') {
    return axios.post(
      path,
      body,
      config
    )
  } else if (method === 'GET') {
    return axios.get(path, config)
  } else if (method === 'DELETE') {
    return axios.delete(path, config)
  } else if (method === 'PUT') {
    return axios.put(path, body, config)
  }
}

export const getId = (url) => { // Function to get the youtube video id from  https://stackoverflow.com/questions/21607808/convert-a-youtube-video-url-to-embed-code
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

export const capitalizeFirstLetter = (string) => { // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const listingObjectValidator = (formObject, bedroomArray, amenities) => {
  const nonEmptyTextFields = ['title', 'type', 'price', 'street', 'city', 'state', 'postcode', 'country', 'thumbnail']
  for (const textFields of nonEmptyTextFields) {
    if (formObject[textFields] === '' || formObject[textFields] === null) {
      throw new Error(`${capitalizeFirstLetter(textFields)} cannot be empty`)
    }
  }
  const postCodeRegex = /^\d{4}$/
  if (!postCodeRegex.test(formObject.postcode)) {
    throw new Error('Invalid Postcode Format');
  }
  if (formObject.files.length < 1) {
    throw new Error('You must atleast upload 1 property image')
  }
  if (isNaN(formObject.price)) {
    throw new Error('Price must be a number');
  }
  if (formObject.price <= 0) {
    throw new Error('Price must be above 0')
  }
  if (isNaN(formObject.bathrooms)) {
    throw new Error('Number of bathroom must be a number');
  }
  if (formObject.bathrooms < 0) {
    throw new Error('Number of Bathroom cannot be below 0')
  }
  if (formObject.url !== '') {
    const regex = /^(https?:\/\/)?((www.)?youtube.com|youtu.be)\/.+$/i;
    if (!regex.test(formObject.url)) {
      throw new Error('Invalid Youtube URL')
    }
  }
  bedroomArray.forEach(element => {
    if (isNaN(element.beds)) {
      throw new Error('Number of beds in each bedroom must be a number');
    }
    if (element.beds < 0) {
      throw new Error('Number of Beds cannot be below 0')
    }
  });
}

export const getLuxonDayDifference = (startDate, endDate) => {
  return endDate.diff(startDate, ['days']).toObject().days;
}

export const isoDateToDDMMYYYY = (date) => {
  const splittedDate = date.split('-');
  return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
}

export const addDurationAndDateToBookingArray = (bookings) => {
  return bookings.map((booking) => {
    const duration = getLuxonDayDifference(DateTime.fromSQL(booking.dateRange.startDate), DateTime.fromSQL(booking.dateRange.endDate));
    return { ...booking, duration: `${duration} days`, date: `${isoDateToDDMMYYYY(booking.dateRange.startDate)} -  ${isoDateToDDMMYYYY(booking.dateRange.endDate)}` }
  });
}

export const addAverageRatingAndNumberOfBedsToListing = (listing) => {
  let numberOfBeds = 0;
  let averageRating = 0;
  listing.metadata.bedrooms.forEach((room) => {
    numberOfBeds += room.beds
  })

  listing.reviews.forEach((review) => {
    averageRating += review.rating
  })
  averageRating = listing.reviews.length > 0 ? (averageRating / listing.reviews.length).toFixed(2) : null
  return { ...listing, numberOfBeds, averageRating }
}
