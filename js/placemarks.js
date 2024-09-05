// Import necessary functions and configuration from utility.js and config.js
import { calculateImageCoordinates, getImagePosition } from './utility.js';
import config from './config.js';


// Initialize the boolean variable to control placemark placement
let isPlacemarkEnabled = false;

// Initialize the array to store placemark objects
export const placemarks = [];

// Get the reference to the image element with id "map"
export const imageElement = document.getElementById('map');


// Add an event listener to the "Add Placemarks" button
const addPlacemarksBtn = document.getElementById('addPlacemarksBtn');
addPlacemarksBtn.addEventListener('click', () => {
  // Toggle the boolean variable for enabling/disabling placemark placement
  isPlacemarkEnabled = !isPlacemarkEnabled;

  // Change the button text based on the state
  addPlacemarksBtn.textContent = isPlacemarkEnabled ? 'Disable Placemarks' : 'Add Placemarks';

  // Add an event listener for the click event on the "Clear Placemarks" button
  const clearPlacemarksBtn = document.getElementById('clearPlacemarksBtn');
  clearPlacemarksBtn.addEventListener('click', () => {
    // Clear the placemarks array
    placemarks.length = 0;

    // Clear the placemarks on the map by rendering an updated view
    const coordinates = calculateImageCoordinates(config);
    renderPlacemarks(coordinates, placemarks, getImagePosition);
  });
});

// Add an event listener for the click event on the image
imageElement.addEventListener('click', (event) => {
  // Check if placemark placement is enabled
  if (isPlacemarkEnabled) {
    // Get the current image coordinates based on the configuration
    const coordinates = calculateImageCoordinates(config);
    const upper_left_lat_coordinate = coordinates[0];
    const upper_left_lon_coordinate = coordinates[1];
    const lower_right_lat_coordinate = coordinates[2];
    const lower_right_lon_coordinate = coordinates[3];

    // Calculate the latitude and longitude of the clicked point
    const clickedCoordinates = {
      // Calculate the latitude based on the event and image coordinates
      input_lat:
        upper_left_lat_coordinate -
        (event.offsetY / imageElement.clientHeight) *
          (upper_left_lat_coordinate - lower_right_lat_coordinate),

      // Calculate the longitude based on the event and image coordinates
      input_lon:
        (event.offsetX / imageElement.clientWidth) *
          (lower_right_lon_coordinate - upper_left_lon_coordinate) +
        upper_left_lon_coordinate,
    };

    // Create a new placemark object with calculated coordinates and an image source
    const placemark = {
      coordinates: [clickedCoordinates.input_lat, clickedCoordinates.input_lon],
      imageSrc: 'icons/map-pin-red.png', // Image source 
    };

    // Append the new placemark object to the placemarks array
    placemarks.push(placemark);

    // Render the updated placemarks on the map
    renderPlacemarks(coordinates, placemarks, getImagePosition);
  }
});

// Function to render placemarks on the map
export function renderPlacemarks(coordinates, placemarks, getImagePosition) {
  // Clear existing placemarks on the map by emptying the placemark container
  document.getElementById('placemark-container').innerHTML = '';

  // Render each placemark on the map
  placemarks.forEach((placemark) => {
    // Get the image position based on placemark coordinates and map coordinates
    const { image_X_position, image_Y_position } = getImagePosition(
      placemark.coordinates[0],
      placemark.coordinates[1],
      coordinates[0],
      coordinates[1],
      coordinates[2],
      coordinates[3]
    );

    // Create a new image element for the placemark
    const placemarkImage = document.createElement('img');
    placemarkImage.src = placemark.imageSrc;
    placemarkImage.style.position = 'absolute';
    placemarkImage.style.left = image_X_position + 'px';
    placemarkImage.style.top = (image_Y_position - 28) + 'px';
    placemarkImage.style.width = '30px';
    placemarkImage.style.height = '30px';
    placemarkImage.style.zIndex = '4';

    // Append the image to the map by adding it to the placemark container
    document.getElementById('placemark-container').appendChild(placemarkImage);
  });
}
