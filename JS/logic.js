var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [40.73, -74.0059],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }

  function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var stations = response.features;
  
    // Initialize an array to hold bike markers
    var Earthquakemarkers = [];
  
    // Loop through the stations array
    for (var index = 0; index < stations.length; index++) {
      var station = stations[index];
      
      // For each station, create a marker and bind a popup with the station's name
      var Earthquakemarker = L.circle([station.geometry.coordinates[1], station.geometry.coordinates[0]],
        {
          fillOpacity: station.properties.mag*.30,
          color: "white",
          fillColor: "red",
          // Adjust radius
          radius: station.properties.mag*10000
        })
        .bindPopup("<h3>" + station.properties.place + "<h3><h3>Magnitude: " + station.properties.mag + "<h3>");
      // Add the marker to the Earthquakemarkers array
      Earthquakemarkers.push(Earthquakemarker);
    }
    createMap(L.layerGroup(Earthquakemarkers));
  }
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);