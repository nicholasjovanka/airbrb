import axios from 'axios'
import { BACKEND_PORT } from '../config.js';

export function fileToDataUrl (file) {
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

export function apiCall (url, method, body = {}, queryString = null) {
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
