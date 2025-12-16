import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- CLICK HANDLER COMPONENT ---
function LocationSelector({ setPickup, setDropoff, step }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (step === 'pickup') {
        setPickup([lat, lng]);
        console.log("Pickup Set:", lat, lng);
      } else if (step === 'dropoff') {
        setDropoff([lat, lng]);
        console.log("Dropoff Set:", lat, lng);
      }
    },
  });
  return null;
}

const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, step }) => {
  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {/* This invisible component handles the clicks */}
      <LocationSelector setPickup={setPickup} setDropoff={setDropoff} step={step} />

      {/* Show Markers if they exist */}
      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}
      {dropoff && (
        <Marker position={dropoff}>
          <Popup>Drop Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default IndoraMap;