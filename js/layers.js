// Importing necessary functions and configurations from external files
import { calculateImageCoordinates, getImagePosition } from './utility.js';
import { placemarks, renderPlacemarks } from './placemarks.js';
import { polylineCoordinates, renderPolyline, ctx } from './polylines.js';
import config from './config.js';

// Declaring an array to store saved layers
export let savedLayers = [];

// Event listener for the "Save Layer" button
const saveLayerBtn = document.getElementById('saveLayerBtn');
saveLayerBtn.addEventListener('click', () => {
  // Prompt the user for a layer name
  const layerName = prompt('Enter a name for the layer:');

  // Check if the user entered a layer name
  if (layerName !== null && layerName.trim() !== '') {
    // Create a new layer object containing placemarks, polylineCoordinates, and the layer name
    const newLayer = {
      name: layerName,
      placemarks: [...placemarks], // Copy current placemarks
      polylineCoordinates: [...polylineCoordinates], // Copy current polylineCoordinates
      // Add other properties as needed based on your requirements
    };

    // Add the new layer to the savedLayers array
    savedLayers.push(newLayer);

    // Display a button for the saved layer in the sidebar
    displaySavedLayerButton(savedLayers.length, layerName);
  }
});

// Event listener for the "Delete Layer(s)" button
const deleteLayerBtn = document.getElementById('deleteLayerBtn');
deleteLayerBtn.addEventListener('click', () => {
  // Get all checkboxes for saved layers
  const checkboxes = document.querySelectorAll('[type="checkbox"]');
  
  // Iterate through checkboxes and delete corresponding layers
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      // Remove the layer from savedLayers array
      savedLayers.splice(index, 1);
      
      // Remove the checkbox and label from the sidebar
      const checkboxContainer = checkbox.parentElement;
      checkboxContainer.remove();
    }
  });
});

// Function to display a checkbox for the saved layer in the sidebar
export function displaySavedLayerButton(layerNumber, layerName) {
  const savedLayersContainer = document.getElementById('savedLayersContainer');

  // Create a container div for the saved layer
  const layerContainer = document.createElement('div');
  layerContainer.classList.add('mb-2');

  // Create a checkbox for the saved layer
  const layerCheckbox = document.createElement('input');
  layerCheckbox.type = 'checkbox';
  layerCheckbox.id = `layerCheckbox${layerNumber}`;

  // Create a label for the checkbox with the layer name
  const layerLabel = document.createElement('label');
  layerLabel.textContent = `Layer ${layerNumber}: ${layerName}`;
  layerLabel.htmlFor = `layerCheckbox${layerNumber}`;

  // Add an event listener to switch to the saved layer when the checkbox is clicked
  layerCheckbox.addEventListener('change', () => switchToSavedLayer(layerNumber));

  // Append the checkbox and label to the layer container
  layerContainer.appendChild(layerCheckbox);
  layerContainer.appendChild(layerLabel);

  // Append the container to the sidebar
  savedLayersContainer.appendChild(layerContainer);
}

// Function to switch to a saved layer
function switchToSavedLayer(layerNumber) {
  const layerIndex = layerNumber - 1;

  // Update the current placemarks and polylineCoordinates arrays based on the selected layer
  placemarks.length = 0;
  polylineCoordinates.length = 0;

  // Iterate through all checkboxes to combine placemarks and polylineCoordinates from selected layers
  savedLayers.forEach((layer, index) => {
    const checkbox = document.getElementById(`layerCheckbox${index + 1}`);
    if (checkbox.checked) {
      const coordinates = calculateImageCoordinates(config);

      // Add placemarks from the selected layer
      placemarks.push(...layer.placemarks);

      // Add polylineCoordinates from the selected layer
      polylineCoordinates.push(...layer.polylineCoordinates);
    }
  });

  // Render the placemarks and polylines on the map
  const coordinates = calculateImageCoordinates(config);
  renderPlacemarks(coordinates, placemarks, getImagePosition);
  renderPolyline(coordinates, polylineCoordinates, getImagePosition, ctx);
}
