// Import placemarks and polylineCoordinates from external files
import { placemarks } from './placemarks.js';
import { polylineCoordinates } from './polylines.js';



// DOWNLOAD IMAGE
// Add an event listener for the "Image" dropdown item
const downloadImageBtn = document.getElementById('downloadImageBtn');

downloadImageBtn.addEventListener('click', () => {
  // Capture the screenshot of the map-container
  html2canvas(document.getElementById('map-container')).then((canvas) => {
    // Create an anchor element to download the image
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png'); // Data URL representing the image
    downloadLink.download = 'map_image.png';

    // Append the anchor element to the body and trigger a click to start the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the anchor element from the body
    document.body.removeChild(downloadLink);
  });
});



// DOWNLOAD KML
// Add an event listener for the "KML" dropdown item
const downloadKMLBtn = document.getElementById('downloadKMLBtn');

downloadKMLBtn.addEventListener('click', () => {
  // Create separate KML files for placemarks and polylines
  const placemarksKML = generatePlacemarksKML(); // Generate KML content for placemarks
  const polylinesKML = generatePolylinesKML();   // Generate KML content for polylines

  // Combine placemarks and polylines KML content
  const combinedKML = `${placemarksKML}\n${polylinesKML}`;

  // Create a Blob from the combined KML content
  const blob = new Blob([combinedKML], { type: 'application/xml' });

  // Create a download link for the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob); // URL representing the KML Blob
  downloadLink.download = 'map_data.kml';

  // Append the link to the body and trigger a click to start the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Remove the link from the body
  document.body.removeChild(downloadLink);
});


// Function to generate KML content for placemarks
function generatePlacemarksKML() {
  // Assuming placemarks array contains objects with 'coordinates' and 'imageSrc' properties
  const placemarksKMLContent = placemarks
    .map(
      (placemark, index) =>
        `<Placemark id="Placemark_${index}">
          <name>Placemark ${index + 1}</name>
          <LookAt>
            <longitude>${placemark.coordinates[1]}</longitude>
            <latitude>${placemark.coordinates[0]}</latitude>
            <altitude>0</altitude>
          </LookAt>
          <styleUrl>#__managed_style_033DA21BBA2E1D243F8F</styleUrl>
          <Point>
            <coordinates>${placemark.coordinates[1]},${placemark.coordinates[0]},0</coordinates>
          </Point>
        </Placemark>`
    )
    .join('\n');

  // Return KML content for placemarks
  return `<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n${placemarksKMLContent}`;
}


// Function to generate KML content for polylines
function generatePolylinesKML() {
  // Assuming polylineCoordinates array contains arrays of coordinates [lat, lon]
  const polylinesKMLContent = `<Placemark id="Polyline">
    <name>Polyline</name>
    <LookAt>
      <longitude>${polylineCoordinates[0][1]}</longitude>
      <latitude>${polylineCoordinates[0][0]}</latitude>
      <altitude>0</altitude>
    </LookAt>
    <styleUrl>#__managed_style_033DA21BBA2E1D243F8F</styleUrl>
    <LineString>
      <coordinates>${polylineCoordinates
        .map((coordinate) => `${coordinate[1]},${coordinate[0]},0`)
        .join(' ')}</coordinates>
    </LineString>
  </Placemark>`;

  // Return KML content for polylines
  return `${polylinesKMLContent}\n</Document>\n</kml>`;
}
