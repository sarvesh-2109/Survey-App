// Importing savedLayers array and displaySavedLayerButton function from 'layers.js'
import { savedLayers, displaySavedLayerButton } from './layers.js';

// Function to handle file upload and plot KML on the map
function handleKMLUpload() {
    // Get the file input element
    const uploadKMLBtn = document.getElementById('uploadKMLBtn');
  
    // Add an event listener to the file input element
    uploadKMLBtn.addEventListener('change', (event) => {
        // Get the selected file from the input
        const file = event.target.files[0];
  
        if (file) {
            // Read the contents of the file using FileReader
            const reader = new FileReader();
  
            reader.onload = function (e) {
                // Parse the KML content
                const kmlContent = e.target.result;
  
                // Extract placemarks and polylines from KML content
                const { placemarks, polylineCoordinates } = extractFeaturesFromKML(kmlContent);
  
                // Prompt the user for a layer name (using the uploaded file name)
                const layerName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
  
                // Create a new layer object containing placemarks, polylines, and the layer name
                const newLayer = {
                    name: layerName,
                    placemarks: [...placemarks],
                    polylineCoordinates: [...polylineCoordinates],
                    // Add other properties as needed based on your requirements
                };
  
                // Add the new layer to the savedLayers array
                savedLayers.push(newLayer);
  
                // Display a button for the saved layer in the sidebar
                displaySavedLayerButton(savedLayers.length, layerName);
            };
  
            // Read the file as text
            reader.readAsText(file);
        }
    });
}

// Function to extract placemarks and polylines from KML content
function extractFeaturesFromKML(kmlContent) {
    // Parse the KML content using an appropriate parser (e.g., DOMParser)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlContent, 'application/xml');
  
    // Extract placemark and polyline elements from the KML document
    const placemarkElements = xmlDoc.getElementsByTagName('Placemark');
    const polylineElements = xmlDoc.getElementsByTagName('LineString');
  
    // Create arrays to store extracted placemarks and polylines
    const placemarks = [];
    const polylineCoordinates = [];
  
    // Extract placemarks
    for (let i = 0; i < placemarkElements.length; i++) {
        const placemarkElement = placemarkElements[i];
        const coordinatesElement = placemarkElement.querySelector('coordinates');
  
        if (coordinatesElement) {
            // Splitting coordinates and converting to numeric values
            const coordinates = coordinatesElement.textContent.trim().split(',');
            const latitude = parseFloat(coordinates[1]);
            const longitude = parseFloat(coordinates[0]);
  
            // Creating a placemark object with coordinates and image source
            const placemark = {
                coordinates: [latitude, longitude],
                imageSrc: 'icons/pin-fill.svg', // Image source
                // Add other properties as needed based on your requirements
            };
  
            placemarks.push(placemark);
        }
    }
  
    // Extract polylines
    for (let i = 0; i < polylineElements.length; i++) {
        const polylineElement = polylineElements[i];
        const coordinatesElement = polylineElement.querySelector('coordinates');
  
        if (coordinatesElement) {
            // Splitting coordinates and mapping to an array of [latitude, longitude]
            const coordinates = coordinatesElement.textContent.trim().split(' ');
            const polyline = coordinates.map((coord) => {
                const [longitude, latitude] = coord.split(',').map(parseFloat);
                return [latitude, longitude];
            });
  
            polylineCoordinates.push(polyline);
        }
    }
  
    return { placemarks, polylineCoordinates };
}

// Call the function to handle KML upload
handleKMLUpload();
