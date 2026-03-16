// src/components/IndoraMap.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// --- PREMIUM CUSTOM MARKERS ---
// A clean Red pin for Pickup
const pickupIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// A clean Black pin for Dropoff
const dropoffIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const carIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/741/741407.png',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});

const MapIcons = {
    Location: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Target: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
        </svg>
    )
};

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

const MapWatermark = () => {
  const map = useMap();
  useEffect(() => {
    const WatermarkControl = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'map-watermark');
        div.className = "m-4";
        div.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); padding: 10px 20px; border-radius: 20px; 
                      border: 1px solid rgba(255, 255, 255, 0.6); color: #18181b; font-weight: 900; font-size: 14px;
                      box-shadow: 0 8px 30px rgba(0,0,0,0.06); pointer-events: none; display: flex; align-items: center; letter-spacing: -0.5px;">
            <span style="color: #dc2626; margin-right: 5px; font-style: italic;">PARCEEL</span> Active
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

const AreaMarks = () => {
    const availableZones = [
        { name: "Maninagar", coords: [22.9978, 72.6009] },
        { name: "Narol", coords: [22.9733, 72.5931] },
        { name: "Isanpur", coords: [22.9868, 72.5977] },
        { name: "Vastrapur", coords: [23.0225, 72.5714] },
    ];

    return availableZones.map((zone, idx) => (
        <React.Fragment key={idx}>
            <CircleMarker center={zone.coords} radius={10} pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.3, weight: 2 }}>
                <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span className="font-bold text-red-700 tracking-tight">Available</span>
                </Tooltip>
            </CircleMarker>
        </React.Fragment>
    ));
};

function RoutingEngine({ pickup, dropoff }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !pickup || !dropoff) return;

    // Automatically zoom out to perfectly fit both pickup and dropoff on screen!
    const bounds = L.latLngBounds([pickup, dropoff]);
    map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });

    if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
      lineOptions: { styles: [{ color: '#dc2626', weight: 5, opacity: 0.9 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false, // Turned off because we handle it better above
      show: false 
    }).addTo(map);

    return () => {
        if (routingControlRef.current && map) {
            map.removeControl(routingControlRef.current);
        }
    };
  }, [map, pickup, dropoff]);
  return null;
}

function ActionButtons({ setPickup, setPickupAddress, setDropoff, setDropoffAddress, step }) {
  const map = useMap();

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const coords = [latitude, longitude];
            map.flyTo(coords, 17, { animate: true, duration: 1.5 });
            setPickup(coords);
            const address = await getAddressFromCoords(latitude, longitude);
            setPickupAddress(address);
        },
        (error) => {
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
          className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-white/60 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center pointer-events-auto"
        >
          <MapIcons.Location />
        </button>
      ) : step === 'dropoff' ? (
        <button 
            onClick={handleSetDropoff}
            className="bg-zinc-900 text-white px-6 py-4 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-black flex items-center gap-2 pointer-events-auto tracking-wide"
        >
            <MapIcons.Target />
            Set Dropoff at Center
        </button>
      ) : null}
    </div>
  );
}

const IndoraMap = ({ pickup, setPickup, dropoff, setDropoff, pickupAddress, dropoffAddress, setPickupAddress, setDropoffAddress, step, driverLocation }) => {
  return (
    <MapContainer center={[22.9868, 72.5977]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      {/* HIGH ACCURACY GOOGLE MAPS TILE LAYER */}
      <TileLayer 
        url="http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
        maxZoom={20}
        attribution="&copy; Google Maps"
      />
      
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
      
      {/* Updated to use Red and Black pins */}
      {pickup && <Marker position={pickup} icon={pickupIcon}><Popup><span className="font-bold">Pickup:</span> {pickupAddress}</Popup></Marker>}
      {dropoff && <Marker position={dropoff} icon={dropoffIcon}><Popup><span className="font-bold">Dropoff:</span> {dropoffAddress}</Popup></Marker>}
      
      {driverLocation && driverLocation[0] && (
          <Marker position={driverLocation} icon={carIcon}>
              <Popup>Your Driver is here!</Popup>
          </Marker>
      )}
    </MapContainer>
  );
};

export default IndoraMap;