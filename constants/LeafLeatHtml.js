const LeafletMapHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style> 
      #map { 
        height: 100vh;
        width: 100vw;
        background: #f8f8f8;
        touch-action: none;
      }
      html, body { 
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      .current-location-icon {
        background-color: #4285F4;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #4285F4;
      }
      .location-pulse {
        border-radius: 50%;
        height: 14px;
        width: 14px;
        position: absolute;
        background: rgba(66, 133, 244, 0.2);
        animation: pulse 2s ease-out infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
    </style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
    <script>
      setTimeout(() => {
        try {
          const locationStr = 'LOCATION_PLACEHOLDER';
          const markerStr = 'MARKER_PLACEHOLDER';
          let coordinates;

          if (locationStr && locationStr !== 'LOCATION_PLACEHOLDER') {
            coordinates = locationStr.split(',').map(coord => parseFloat(coord.trim()));
          } else {
            coordinates = [26.6427, 87.7109];
          }

          const map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: false,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true
          }).setView(coordinates, 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(map);

          // Current location marker
          const locationIcon = L.divIcon({
            className: 'current-location-icon',
            html: '<div class="location-pulse"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          // Add current location marker
          L.marker(coordinates, { icon: locationIcon })
            .bindPopup('Your Location')
            .addTo(map);
          
          // Add marker at specified coordinates with title
          if (markerStr && markerStr !== 'MARKER_PLACEHOLDER') {
            const markerCoords = markerStr.split(',').map(coord => parseFloat(coord.trim()));
            L.marker(markerCoords)
              .bindPopup('Pickup Location')  // This adds a popup with the title
              .addTo(map);
          }

          setTimeout(() => {
            map.invalidateSize();
          }, 250);
        } catch (e) {
          console.error('Error initializing map:', e);
        }
      }, 100);
    </script>
  </body>
</html>
`;

export default LeafletMapHTML;