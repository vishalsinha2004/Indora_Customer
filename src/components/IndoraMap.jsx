// ... (Keep the imports at the top exactly the same) ...
import React, { useState } from 'react'; // Ensure React is imported
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// (Keep the Icon fix code here...)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const carIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/741/741407.png', // You can use any car PNG URL
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});
// --- NEW: Helper function to get address ---
const getAddressFromCoords = async (lat, lng) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.display_name.split(",")[0] + ", " + data.display_name.split(",")[1]; // Shorten address
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Unknown Location";
    }
};

function LocationSelector({ setPickup, setDropoff, setPickupAddress, setDropoffAddress, step }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      
      // Fetch the address string
      const address = await getAddressFromCoords(lat, lng);

      if (step === 'pickup') {
        setPickup([lat, lng]);
        setPickupAddress(address); // Set the text!
      } else if (step === 'dropoff') {
        setDropoff([lat, lng]);
        setDropoffAddress(address); // Set the text!
      }
    },
  });
  return null;
}

const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, setPickupAddress, setDropoffAddress, step, routeGeometry, driverLocation }) => {
  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      <LocationSelector 
        setPickup={setPickup} 
        setDropoff={setDropoff} 
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
        step={step} 
      />

      {pickup && <Marker position={pickup}><Popup>Pickup</Popup></Marker>}
      {dropoff && <Marker position={dropoff}><Popup>Dropoff</Popup></Marker>}

      {/* NEW: Render the Moving Car */}
      {driverLocation && (
        <Marker position={driverLocation} icon={carIcon}>
            <Popup>Your Driver is here!</Popup>
        </Marker>
      )}

      {routeGeometry && (
        <GeoJSON 
            key={JSON.stringify(routeGeometry)} 
            data={routeGeometry} 
            style={{ color: "blue", weight: 5, opacity: 0.7 }} 
        />
      )}
    </MapContainer>
  );
};

export default IndoraMap;