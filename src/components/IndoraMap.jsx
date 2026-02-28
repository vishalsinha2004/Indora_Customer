// src/components/IndoraMap.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Tooltip } from 'react-leaflet';
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

// --- Helper: SVGs for Claymorphism UI ---
const MapIcons = {
    Location: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Target: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
        </svg>
    )
};

// --- Helper: Get Address from Coords ---
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

// --- Component: Branding Watermark ---
const MapWatermark = () => {
  const map = useMap();
  useEffect(() => {
    const WatermarkControl = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'map-watermark');
        div.className = "m-4";
        div.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); padding: 10px 20px; border-radius: 20px; 
                      border: 1px solid rgba(255, 255, 255, 0.4); color: #2563eb; font-weight: 800; font-size: 14px;
                      box-shadow: 8px 8px 16px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8); pointer-events: none; display: flex; align-items: center;">
            Indora Active in Ahmedabad
          </div>
        `;
        return div;
      }
    });
    const watermark = new WatermarkControl({ position: 'topright' });
    watermark.addTo(map);
    return () => watermark.remove();
  }, [map]);
  return null;
};

// --- Component: Area Marks ---
const AreaMarks = () => {
    const availableZones = [
        { name: "Maninagar", coords: [22.9978, 72.6009] },
        { name: "Narol", coords: [22.9733, 72.5931] },
        { name: "Isanpur", coords: [22.9868, 72.5977] },
        { name: "Vastrapur", coords: [23.0225, 72.5714] },
    ];

    return availableZones.map((zone, idx) => (
        <React.Fragment key={idx}>
            <CircleMarker center={zone.coords} radius={10} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.6 }}>
                <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span className="font-bold text-green-800">Available</span>
                </Tooltip>
            </CircleMarker>
        </React.Fragment>
    ));
};

// --- Component: Routing Engine ---
function RoutingEngine({ pickup, dropoff }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !pickup || !dropoff) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
      lineOptions: { styles: [{ color: '#2563eb', weight: 6, opacity: 0.8 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false 
    }).addTo(map);
    return () => map.removeControl(routingControl);
  }, [map, pickup, dropoff]);
  return null;
}

// --- Component: Action Buttons (Fixing Pickup Logic) ---
function ActionButtons({ setPickup, setPickupAddress, setDropoff, setDropoffAddress, step }) {
  const map = useMap();

  const handleFetchLocation = () => {
    console.log("Attempting to fetch location..."); // Debug log
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const coords = [latitude, longitude];
            console.log("Location found:", coords);
            map.flyTo(coords, 15);
            setPickup(coords);
            const address = await getAddressFromCoords(latitude, longitude);
            setPickupAddress(address);
        },
        (error) => {
            console.error("Geolocation Error:", error);
            alert("Unable to retrieve location. Please ensure Location Permissions are ON.");
        },
        { enableHighAccuracy: true }
    );
  };

  const handleSetDropoff = async () => {
    const center = map.getCenter();
    const coords = [center.lat, center.lng];
    setDropoff(coords);
    const address = await getAddressFromCoords(center.lat, center.lng);
    setDropoffAddress(address);
  };

  return (
    <div className="leaflet-bottom leaflet-left mb-32 ml-4" style={{ zIndex: 5000 }}>
      {step === 'pickup' ? (
        <button 
          onClick={handleFetchLocation} 
          className="bg-white p-4 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] hover:scale-110 active:scale-90 transition-all duration-200 flex items-center justify-center border border-white/40 pointer-events-auto"
        >
          <MapIcons.Location />
        </button>
      ) : (
        <button 
            onClick={handleSetDropoff}
            className="bg-blue-600 text-white px-6 py-4 rounded-[20px] shadow-[8px_8px_20px_rgba(37,99,235,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.2)] hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 font-black flex items-center gap-2 border border-blue-400/30 pointer-events-auto"
        >
            <MapIcons.Target />
            Set Dropoff at Center
        </button>
      )}
    </div>
  );
}

const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, pickupAddress, dropoffAddress, setPickupAddress, setDropoffAddress, step }) => {
  return (
    <MapContainer center={[22.9868, 72.5977]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapWatermark />
      <AreaMarks />
      <ActionButtons 
        setPickup={setPickup} 
        setPickupAddress={setPickupAddress} 
        setDropoff={setDropoff}
        setDropoffAddress={setDropoffAddress}
        step={step}
      />
      <RoutingEngine pickup={pickup} dropoff={dropoff} />
      {pickup && <Marker position={pickup}><Popup>Pickup: {pickupAddress}</Popup></Marker>}
      {dropoff && <Marker position={dropoff}><Popup>Dropoff: {dropoffAddress}</Popup></Marker>}
    </MapContainer>
  );
};

export default IndoraMap;