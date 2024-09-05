// Importing configuration, utility functions, and data structures from external modules
import config from './config.js';
import { calculateImageCoordinates, getImagePosition } from "./utility.js";
import { placemarks } from "./placemarks.js";
import { polylineCoordinates, renderPolyline, ctx } from "./polylines.js";
import { savedLayers, displaySavedLayerButton } from "./layers.js";

// Accessing the file input element from the DOM
const uploadCSVBtn = document.getElementById('uploadCSVBtn');

// Adding an event listener to the file input element for CSV upload
uploadCSVBtn.addEventListener('change', (event) => {
  // Get the selected file from the input
  const file = event.target.files[0];

  if (file) {
    // Parsing the contents of the file using PapaParse library
    Papa.parse(file, {
      header: true,          // Indicates that the first row contains headers
      dynamicTyping: true,    // Automatically converts appropriate values to numbers or booleans
      complete: function (results) {
        // Extracting longitude and latitude from the CSV data
        const points = results.data.map((row) => ({
          latitude: row.latitude,                         // Latitude value from CSV row
          longitude: row.longitude,                       // Longitude value from CSV row
          altitude: row.altitude,                         // Altitude value from CSV row
          distance_from_boundarycentre: row.distance_from_boundarycentre, // Distance value from CSV row
        }));

        // Calculating image coordinates based on the map configuration
        const mapCoordinates = calculateImageCoordinates(config);

        // Converting CSV points to polyline coordinates and filtering within boundaries
        const filteredPolylineCoordinates = points
          .map((point) => {
            // Converting latitude and longitude to image positions
            const imagePosition = getImagePosition(
              point.latitude,
              point.longitude,
              mapCoordinates[0],
              mapCoordinates[1],
              mapCoordinates[2],
              mapCoordinates[3]
            );

            // Checking if the point is within the specified boundaries
            if (
              imagePosition.image_X_position >= 0 &&
              imagePosition.image_X_position <= 893 &&
              imagePosition.image_Y_position >= 0 &&
              imagePosition.image_Y_position <= 893
            ) {
              return [point.latitude, point.longitude]; // Including points within boundaries
            } else {
              return null; // Excluding points outside boundaries
            }
          })
          .filter((point) => point !== null);

        // Clearing existing placemarks and polylineCoordinates arrays
        placemarks.length = 0;
        polylineCoordinates.length = 0;

        // Assigning CSV polyline coordinates within boundaries to the polylineCoordinates array
        polylineCoordinates.push(...filteredPolylineCoordinates);

        // Rendering the polylines on the map
        const coordinates = calculateImageCoordinates(config);
        renderPolyline(coordinates, polylineCoordinates, getImagePosition, ctx);

        // Saving the CSV data as a layer
        const layerName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
        const newLayer = {
          name: layerName,
          placemarks: [...placemarks],
          polylineCoordinates: [...polylineCoordinates], // Copying corrected polylineCoordinates
          // Add other properties as needed based on your requirements
        };

        // Adding the new layer to the savedLayers array
        savedLayers.push(newLayer);

        // Displaying a button for the saved layer in the sidebar
        displaySavedLayerButton(savedLayers.length, layerName);

        // Resetting the value of the file input element to allow uploading the same file again
        uploadCSVBtn.value = null;
      },
    });
  }
});
