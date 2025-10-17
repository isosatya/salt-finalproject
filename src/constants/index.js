// API URLs
export const PUNK_API_BASE_URL = 'https://api.punkapi.com/v2/beers';
export const MAPBOX_API_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYW5kcmVzc2luZ2giLCJhIjoiY2p4OTBvYXc5MHF5eDN6bzFjcmptajJpcSJ9.5Tol6P4vdEEbHtgyOzZcQw';

// File upload settings
export const MAX_FILE_SIZE = 2097152; // 2MB in bytes
export const S3_URL_PREFIX = 'https://s3.amazonaws.com/andres-spiced/';

// UI Constants
export const RANDOM_BEERS_COUNT = 8;
export const SEARCH_RESULTS_PER_PAGE = 16;
export const CHAT_MESSAGES_LIMIT = 10;
export const BUTTON_UPDATE_DELAY = 300;

// Default images
export const DEFAULT_BEER_IMAGE = '/beer_bottle.png';
export const DEFAULT_PROFILE_IMAGE = './uglydog.jpg';
export const DEFAULT_HOP_IMAGE = './hop.png';

// Cookie settings
export const COOKIE_SECRET = `I'm always angry.`;
export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 90; // 90 days

// Socket origins
export const SOCKET_ORIGINS = 'localhost:8080 http://127.0.0.1:8080/ https://salt-finalproject.herokuapp.com:*';
