import axios from 'axios'
import { BACKEND_PORT } from '../config.js';

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
  const nonEmptyTextFields = ['title', 'type', 'price', 'address', 'thumbnail']
  console.log(formObject);
  for (const textFields of nonEmptyTextFields) {
    if (formObject[textFields] === '' || formObject[textFields] === null) {
      throw new Error(`${textFields} cannot be empty`)
    }
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
