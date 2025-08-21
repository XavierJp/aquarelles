import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { samplePodcasts, categories } from '../data/podcasts';
import '../styles/InteractiveMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons for different categories
const createCustomMarker = (category) => {
  const categoryData = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase());
  const color = categoryData ? categoryData.color : '#2c5f6f';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin" style="background-color: ${color};">
             <div class="marker-icon">🎧</div>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const InteractiveMap = ({ onPodcastSelect }) => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from the backend
    setPodcasts(samplePodcasts);
  }, []);

  const handleListenClick = (podcast) => {
    onPodcastSelect(podcast);
  };

  // Center on Brittany
  const brittanyCenter = [48.2020, -3.5326];
  const zoomLevel = 8;
  
  // Brittany bounds to restrict panning
  const brittanyBounds = [
    [47.0, -6], // Southwest corner
    [49.0, -0.5]  // Northeast corner
  ];

  return (
    <div className="map-container">
      <MapContainer
        center={brittanyCenter}
        zoom={zoomLevel}
        minZoom={9}
        maxZoom={12}
        maxBounds={brittanyBounds}
        maxBoundsOptions={{
          animate: true,
          noMoveStart: true
        }}
        style={{ height: '100vh', width: '100%' }}
        className="watercolor-map"
      >
        <TileLayer
          url="https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg"
          attribution='Map tiles by <a href="https://stamen.com/">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, under <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY SA</a>. Hosted by <a href="https://www.cooperhewitt.org/">Cooper Hewitt</a>.'
          opacity={1.0}
        />

        {podcasts.map((podcast) => (
          <Marker
            key={podcast.id}
            position={[podcast.latitude, podcast.longitude]}
            icon={createCustomMarker(podcast.category)}
          >
            <Popup>
              <div className="popup-content">
                <h4>{podcast.title}</h4>
                <p>{podcast.description.substring(0, 100)}...</p>
                <div className="popup-meta">
                  <span className="category">{podcast.category}</span>
                  <span className="duration">{Math.floor(podcast.duration / 60)} min</span>
                </div>
                <button 
                  className="listen-button"
                  onClick={() => handleListenClick(podcast)}
                >
                  Écouter
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;