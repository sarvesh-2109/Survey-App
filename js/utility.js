// Import the configuration object from config.js
import config from './config.js';

// Function to calculate image coordinates
export function calculateImageCoordinates(config) {
  // Extract relevant information from the configuration object
  const zoom = config.gps.zoom;
  const input_lat = config.gps.centerLat;
  const input_lon = config.gps.centerLng;

  // Calculate the number of tiles based on the zoom level
  const numTiles = Math.pow(2, zoom);

  // Calculate the latitude and longitude range per tile
  const latRange = 360 / numTiles;
  const lonRange = 360 / numTiles;

  // Calculate half of the latitude and longitude range
  const lat = latRange / 2;
  const lon = lonRange / 2;

  // Calculate the coordinates of the image corners
  const upper_left_lat_coordinate = input_lat + lat;
  const upper_left_lon_coordinate = input_lon - lon;
  const lower_right_lat_coordinate = input_lat - lat;
  const lower_right_lon_coordinate = input_lon + lon;

  // Return an array containing the calculated coordinates
  return [
    upper_left_lat_coordinate,
    upper_left_lon_coordinate,
    lower_right_lat_coordinate,
    lower_right_lon_coordinate,
  ];
}

// Call the calculateImageCoordinates function with the config object
const coordinates = calculateImageCoordinates(config);

// Log the calculated coordinates
console.log('Image Coordinates:', coordinates);


// Function to calculate image position based on clicked coordinates
export function getImagePosition(
  input_lat,
  input_lon,
  upper_left_lat_coordinate,
  upper_left_lon_coordinate,
  lower_right_lat_coordinate,
  lower_right_lon_coordinate
) {
  // Dimensions of the image
  const image_X_dimension = 893;
  const image_Y_dimension = 893;

  // Calculate the X position within the image based on the clicked coordinates
  const image_X_position =
    ((input_lon - upper_left_lon_coordinate) /
      (lower_right_lon_coordinate - upper_left_lon_coordinate)) *
    image_X_dimension;

  // Calculate the Y position within the image based on the clicked coordinates
  const image_Y_position =
    ((input_lat - upper_left_lat_coordinate) /
      (lower_right_lat_coordinate - upper_left_lat_coordinate)) *
    image_Y_dimension;

  // Return an object with the calculated image positions
  return { image_X_position, image_Y_position };
}

