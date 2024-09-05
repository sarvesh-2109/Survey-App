# Interactive Map Web Application

This web application allows users to interact with a map, download map images, and upload KML or CSV files to add new layers to the map.

## Features

1. **Download Map Image:**
   - Click the "Download Image" button to capture a screenshot of the map and download it as a PNG image.

2. **Download KML Data:**
   - Click the "Download KML" button to generate and download KML data for placemarks and polylines on the map.

3. **Upload KML Files:**
   - Use the "Upload KML" button to add new layers to the map by uploading KML files containing placemarks and polylines.

4. **Upload CSV Files:**
   - Upload CSV files to add layers with polyline data to the map. Filter points within specified boundaries and visualize them on the map.

## Project Structure

- **js/download.js:**
  - Handles the download functionalities, including capturing map screenshots and generating KML files.

- **js/upload_kml.js:**
  - Manages the upload of KML files, extracting placemarks and polylines to create new layers.

- **js/upload_csv.js:**
  - Deals with uploading CSV files, converting data to polyline coordinates, and visualizing them on the map.

## External Modules and Files

- **placemarks.js:**
  - Contains data for placemarks on the map.

- **polylines.js:**
  - Holds data for polyline coordinates.

- **config.js:**
  - Includes configuration settings for the map.

- **utility.js:**
  - Provides utility functions for calculations related to map coordinates.

- **layers.js:**
  - Manages the saved layers and displays buttons for them in the sidebar.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd interactive-map-web-app
Open index.html in a web browser.

Interact with the map, download images, and upload KML/CSV files.

Dependencies
html2canvas: Used for capturing map screenshots.
PapaParse: Used for parsing CSV files.
License
This project is licensed under the MIT License.

Acknowledgments
Thanks to the authors and contributors of third-party libraries used in this project.
Feel free to contribute or report issues!

css
Copy code

Remember to replace `<repository-url>` with the actual URL of your Git rep