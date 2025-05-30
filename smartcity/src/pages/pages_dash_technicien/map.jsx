// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import '../../styles/map.css';
// import axios from 'axios';

// // Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom marker icons
// const driverIcon = new L.Icon({
//   iconUrl: '/driver-marker.png', // Add this icon to your public folder
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const DEFAULT_LOCATION = {
//   lat: 36.8065, // Coordonnées par défaut (Tunis)
//   lng: 10.1815
// };

// // Search location component
// function SearchControl({ onLocationFound }) {
//   const map = useMap();
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
//       );
      
//       if (response.data && response.data.length > 0) {
//         const { lat, lon } = response.data[0];
//         const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
//         map.setView(location, 15);
//         onLocationFound(location);
//       }
//     } catch (error) {
//       console.error('Error searching location:', error);
//     }
//   };

//   return (
//     <div className="leaflet-top leaflet-left p-2">
//       <div className="leaflet-control leaflet-bar bg-white p-2 rounded shadow-lg">
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search location..."
//             className="px-3 py-2 border rounded"
//           />
//           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
//             Search
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const LeafletMapComponent = ({ onLocationSelect = () => {}, selectedLocations = { pickup: null, dropoff: null } }) => {
//   const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
//   const [markers, setMarkers] = useState({
//     pickup: null,
//     dropoff: null
//   });
//   const [locationError, setLocationError] = useState(null);

//   useEffect(() => {
//     // Get user's current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setLocationError(null);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           setLocationError(error.message);
//           setUserLocation(DEFAULT_LOCATION);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0
//         }
//       );
//     } else {
//       console.log('Geolocation is not supported by this browser.');
//       setLocationError('La géolocalisation n\'est pas supportée par votre navigateur');
//       setUserLocation(DEFAULT_LOCATION);
//     }
//   }, []);

//   const handleMapClick = async (e) => {
//     const { lat, lng } = e.latlng;
    
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       );
//       const data = await response.json();
      
//       const location = {
//         address: data.display_name,
//         coordinates: [lng, lat]
//       };

//       // Determine if we're setting pickup or dropoff
//       const locationType = !markers.pickup ? 'pickup' : 
//                           !markers.dropoff ? 'dropoff' : 'pickup';
      
//       setMarkers(prev => ({
//         ...prev,
//         [locationType]: location
//       }));

//       if (onLocationSelect) {
//         onLocationSelect(location, locationType);
//       }
//     } catch (error) {
//       console.error('Error getting address:', error);
//     }
//   };

//   return (
//     <div className="relative w-full h-full">
//       {locationError && (
//         <div className="absolute top-4 left-4 z-[1000] bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
//           <p className="font-bold">Attention</p>
//           <p>{locationError}</p>
//           <p>Utilisation de la position par défaut (Tunis)</p>
//         </div>
//       )}
//       <MapContainer
//         center={[userLocation.lat, userLocation.lng]}
//         zoom={15}
//         style={{ height: '100%', width: '100%' }}
//         onClick={handleMapClick}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
        
//         <SearchControl onLocationFound={(location) => {
//           onLocationSelect(location, !markers.pickup ? 'pickup' : 'dropoff');
//         }} />

//         {/* User's current location */}
//         <Marker position={[userLocation.lat, userLocation.lng]}>
//           <Popup>
//             {locationError ? 'Position par défaut (Tunis)' : 'Votre position actuelle'}
//           </Popup>
//         </Marker>

//         {/* Pickup marker */}
//         {selectedLocations?.pickup && (
//           <Marker 
//             position={[
//               selectedLocations.pickup.coordinates[1],
//               selectedLocations.pickup.coordinates[0]
//             ]}
//           >
//             <Popup>Pickup: {selectedLocations.pickup.address}</Popup>
//           </Marker>
//         )}

//         {/* Dropoff marker */}
//         {selectedLocations?.dropoff && (
//           <Marker 
//             position={[
//               selectedLocations.dropoff.coordinates[1],
//               selectedLocations.dropoff.coordinates[0]
//             ]}
//           >
//             <Popup>Dropoff: {selectedLocations.dropoff.address}</Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default LeafletMapComponent; 