#!/usr/bin/bash

# script to download Image tile from mapbox `

# Input parameters
# $1 = Input centre longitude (data type: float)
# $2 = Input centre latitude  (data type: float)
# $3 = Zoom level (data type: integer)

# Example usage: 
# chmod +x image_tile.sh
# ./image_tile.sh 80.203561 12.975272 16


# $1, $2, and $3 are command-line arguments representing centerLng, centerLat, and zoom respectively.
echo "const config = { 
    gps: { 
        centerLng: $1, 
        centerLat: $2, 
        zoom: $3 
        } 
    };

export default config;" > js/config.js

# Print the center longitude, latitude, and zoom level to the console.
echo lng: $1
echo lat: $2
echo zoom: $3

# Set various parameters for creating a Mapbox static image.
username=sravya-bhandaru
styleId=clofgx84u005d01o6e5am70l2
static=static
bearing=0
imageWidth=512
imageHeight=512
token=access_token=pk.eyJ1Ijoic3JhdnlhLWJoYW5kYXJ1IiwiYSI6ImNsb2ZheHc5czBtcDYyaW11MHI1d2xrN2QifQ.4oFhlnVTsfXFy_MzizcWDA
url=https://api.mapbox.com/styles/v1

# Construct the final URL for the Mapbox static image.
final_url=$url/$username/$styleId/$static/$1,$2,$3,$bearing/$imageWidth'x'$imageHeight'@2x?'$token

# Print the final URL to the console.
echo $final_url

# Download the Mapbox static image using cURL and save it as "mapTile.jpeg" in the "images" directory.
# Note: The `curl` command fetches the image and outputs the result to the console.
echo `curl -o images/mapTile.jpeg $final_url`

# Print a message indicating that the map tile has been downloaded.
echo map tile downloaded.