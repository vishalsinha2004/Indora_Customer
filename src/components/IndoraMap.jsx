// src/components/IndoraMap.jsx
import React, { useEffect } from 'react'; // Added useEffect here
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import the routing machine CSS and JS
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const getAddressFromCoords = async (lat, lng) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.display_name.split(",")[0] + ", " + data.display_name.split(",")[1];
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Unknown Location";
    }
};

// --- Component to draw the connection line ---
function RoutingEngine({ pickup, dropoff }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickup || !dropoff) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickup[0], pickup[1]),
        L.latLng(dropoff[0], dropoff[1])
      ],
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 5 }] // Blue line
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false // Hides the instruction panel
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, pickup, dropoff]);

  return null;
}

// --- Component for the Current Location button ---
function CurrentLocationButton({ setPickup, setPickupAddress }) {
  const map = useMap();

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        
        map.flyTo(coords, 15);
        setPickup(coords);
        
        const address = await getAddressFromCoords(latitude, longitude);
        setPickupAddress(address);
      },
      () => alert("Unable to retrieve location.")
    );
  };

  return (
    <div className="leaflet-bottom leaflet-left" style={{ marginBottom: '20px', marginLeft: '10px', zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleFetchLocation}
          title="Use Current Location"
          style={{ backgroundColor: 'white', width: '40px', height: '40px', border: 'none', cursor: 'pointer', fontSize: '20px' }}
        >
          📍
        </button>
      </div>
    </div>
  );
}

function LocationSelector({ setPickup, setDropoff, setPickupAddress, setDropoffAddress, step }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const address = await getAddressFromCoords(lat, lng);
      if (step === 'pickup') {
        setPickup([lat, lng]);
        setPickupAddress(address);
      } else if (step === 'dropoff') {
        setDropoff([lat, lng]);
        setDropoffAddress(address);
      }
    },
  });
  return null;
}

const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, pickupAddress, dropoffAddress, setPickupAddress, setDropoffAddress, step }) => {
  return (
    <MapContainer center={[23.0225, 72.5714]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <LocationSelector 
        setPickup={setPickup} setDropoff={setDropoff} 
        setPickupAddress={setPickupAddress} setDropoffAddress={setDropoffAddress} 
        step={step} 
      />

      <CurrentLocationButton setPickup={setPickup} setPickupAddress={setPickupAddress} />
      
      {/* This component connects the two points */}
      <RoutingEngine pickup={pickup} dropoff={dropoff} />

      {pickup && <Marker position={pickup}><Popup>Pickup: {pickupAddress}</Popup></Marker>}
      {dropoff && <Marker position={dropoff}><Popup>Dropoff: {dropoffAddress}</Popup></Marker>}
    </MapContainer>
  );
};

export default IndoraMap;