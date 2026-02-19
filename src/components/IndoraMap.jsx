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
        div.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.9); padding: 8px 15px; border-radius: 20px; 
                      border: 2px solid #2563eb; color: #2563eb; font-weight: bold; font-size: 14px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1); pointer-events: none;">
            🚀 Indora Active in Ahmedabad
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

// --- Component: Area Marks (Ahmedabad Zones) ---
const AreaMarks = () => {
    const availableZones = [
        { name: "Maninagar", coords: [22.9978, 72.6009] },
        { name: "Narol", coords: [22.9733, 72.5931] },
        { name: "Isanpur", coords: [22.9868, 72.5977] },
        { name: "Vastrapur", coords: [23.0225, 72.5714] },
        { name: "Satellite", coords: [23.0280, 72.5712] },
        { name: "Ghatlodia", coords: [23.0325, 72.5710] },
        { name: "Bodakdev", coords: [23.0350, 72.5715] },
        { name: "Naranpura", coords: [23.0285, 72.5718] },
        { name: "Thaltej", coords: [23.0280, 72.5725] },
        { name: "Prahlad Nagar", coords: [23.0288, 72.5720] },
        { name: "Sarkhej", coords: [22.9860, 72.5710] },
        { name: "Shilaj", coords: [22.9865, 72.5715] },
        { name: "Gota", coords: [22.9862, 72.5712] },
        { name: "Vejalpur", coords: [22.9867, 72.5718] },
        { name: "Jodhpur", coords: [22.9863, 72.5714] }
    ];

    return availableZones.map((zone, idx) => (
        <React.Fragment key={idx}>
            <CircleMarker 
                center={zone.coords} 
                radius={10} 
                pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.6 }}
            >
                <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span style={{ fontWeight: 'bold', color: '#166534' }}>📍 {zone.name} Available</span>
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
    const myRouter = L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
    });
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
      router: myRouter,
      lineOptions: { styles: [{ color: '#2563eb', weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false 
    }).addTo(map);
    return () => map.removeControl(routingControl);
  }, [map, pickup, dropoff]);
  return null;
}

// --- Component: Action Buttons (No Touch Logic) ---
function ActionButtons({ setPickup, setPickupAddress, setDropoff, setDropoffAddress, step }) {
  const map = useMap();

  // Restore your working pickup logic
  const handleFetchLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        map.flyTo(coords, 15);
        setPickup(coords);
        const address = await getAddressFromCoords(latitude, longitude);
        setPickupAddress(address);
    });
  };

  // Logic for Dropoff (Uses map center)
  const handleSetDropoff = async () => {
    const center = map.getCenter();
    const coords = [center.lat, center.lng];
    setDropoff(coords);
    const address = await getAddressFromCoords(center.lat, center.lng);
    setDropoffAddress(address);
  };

  return (
    <div className="leaflet-bottom leaflet-left" style={{ marginBottom: '60px', marginLeft: '10px', zIndex: 1000 }}>
      {step === 'pickup' ? (
        <div className="leaflet-control leaflet-bar">
          <button 
            onClick={handleFetchLocation} 
            title="Use Current Location"
            style={{ backgroundColor: 'white', width: '45px', height: '45px', border: 'none', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
          >
            📍
          </button>
        </div>
      ) : (
        <button 
            onClick={handleSetDropoff}
            style={{ 
                backgroundColor: '#2563eb', color: 'white', padding: '10px 15px', 
                borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
            }}
        >
            🏁 Set Dropoff at Center
        </button>
      )}
    </div>
  );
}

// --- MAIN EXPORTED COMPONENT ---
const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, pickupAddress, dropoffAddress, setPickupAddress, setDropoffAddress, step }) => {
  return (
    <MapContainer center={[22.9868, 72.5977]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <MapWatermark />
      <AreaMarks />
      
      {/* LocationSelector removed: No random screen touch allowed */}

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