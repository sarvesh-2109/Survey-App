// Import necessary functions and objects from utility.js and placemarks.js
import { calculateImageCoordinates, getImagePosition } from './utility.js';
import { imageElement } from './placemarks.js';
import config from './config.js';


// Initialize the boolean variable to control polyline placement
let isPolylineEnabled = false;

// Exported variable to store polyline coordinates
export let polylineCoordinates = [];


// Add an event listener for the "Add Polyline" button
const drawPolylineBtn = document.getElementById('drawPolylineBtn');
const canvas = document.getElementById('canvas'); // Assuming you have a canvas element with id="canvas"
export const ctx = canvas.getContext('2d');

drawPolylineBtn.addEventListener('click', () => {
  // Toggle the boolean variable
  isPolylineEnabled = !isPolylineEnabled;

  // Change the button text based on the state
  drawPolylineBtn.textContent = isPolylineEnabled ? 'Disable Polyline' : 'Add Polyline';

  console.log('Polyline Drawing Enabled:', isPolylineEnabled);
  console.log('Polyline Coordinates:', polylineCoordinates);
});

// Update the event listener for the image click to handle polyline drawing
imageElement.addEventListener('click', (event) => {
  // Check if polyline drawing is enabled
  if (isPolylineEnabled) {
    // Get the latitude and longitude of the clicked point using utility.js functions
    const coordinates = calculateImageCoordinates(config);
    const upper_left_lat_coordinate = coordinates[0];
    const upper_left_lon_coordinate = coordinates[1];
    const lower_right_lat_coordinate = coordinates[2];
    const lower_right_lon_coordinate = coordinates[3];

    // Calculate the clicked coordinates based on the clicked point on the image
    const clickedCoordinates = {
      input_lat:
        upper_left_lat_coordinate -
        (event.offsetY / imageElement.clientHeight) * (upper_left_lat_coordinate - lower_right_lat_coordinate),
      input_lon:
        (event.offsetX / imageElement.clientWidth) * (lower_right_lon_coordinate - upper_left_lon_coordinate) +
        upper_left_lon_coordinate,
    };

    // Add the clicked coordinates to the polylineCoordinates array
    polylineCoordinates.push([clickedCoordinates.input_lat, clickedCoordinates.input_lon]);

    // Draw the polyline on the canvas using the renderPolyline function
    renderPolyline(coordinates, polylineCoordinates, getImagePosition, ctx);

    console.log('Polyline Coordinates Updated:', polylineCoordinates);
  }
});

// Exported function to render a polyline on the canvas
export function renderPolyline(coordinates, polylineCoordinates, getImagePosition, ctx) {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw the new polyline on the canvas
  ctx.beginPath();

  if (polylineCoordinates.length > 0) {
    // Map the first polyline coordinate to image position
    const { image_X_position, image_Y_position } = getImagePosition(
      polylineCoordinates[0][0],
      polylineCoordinates[0][1],
      coordinates[0],
      coordinates[1],
      coordinates[2],
      coordinates[3]
    );

    ctx.moveTo(image_X_position, image_Y_position);

    // Loop through the remaining polyline coordinates and draw the polyline
    for (let i = 1; i < polylineCoordinates.length; i++) {
      const { image_X_position, image_Y_position } = getImagePosition(
        polylineCoordinates[i][0],
        polylineCoordinates[i][1],
        coordinates[0],
        coordinates[1],
        coordinates[2],
        coordinates[3]
      );

      ctx.lineTo(image_X_position, image_Y_position);
    }
  }

  // Set the polyline style and stroke
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Function to clear polylines on the map (clear the canvas)
function clearPolylines(ctx) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event listener for the "Clear Polyline" button
clearPolylineBtn.addEventListener('click', () => {
  // Clear the polyline array
  polylineCoordinates.length = 0;

  // Clear the polylines on the map (clear the canvas)
  clearPolylines(ctx);

  console.log('Polyline Cleared');
});
