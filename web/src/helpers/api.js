import { getUserIdFromLocalStorage, showError } from './utils';
import axios from 'axios';

import Cookies from "js-cookie";

const userToken = Cookies.get("session");

export let API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL
    ? import.meta.env.VITE_REACT_APP_SERVER_URL
    : '',
  headers: {
    'New-API-User': getUserIdFromLocalStorage(),
    'Cache-Control': 'no-store',
    'Authorization': `Bearer ${Cookies.get("session")}`,
    withCredentials: true
  }
});

export function updateAPI() {
  API = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL
      ? import.meta.env.VITE_REACT_APP_SERVER_URL
      : '',
    headers: {
      'New-API-User': getUserIdFromLocalStorage(),
      'Cache-Control': 'no-store',
      'Authorization': `Bearer ${Cookies.get("session")}`,
      withCredentials: true
    }
  });
}

API.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
  },
);
