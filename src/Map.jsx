import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapCenter({ place }) {
  const map = useMap();

  if (place) {
    map.flyTo(
      [place.lat, place.lng],
      14,
      {
        duration: 1.5,
      }
    );
  }

  return null;
}

function MapView({
  places,
  selectedPlace,
  onSelectPlace,
}) {
  const defaultPosition = selectedPlace
    ? [
        selectedPlace.lat,
        selectedPlace.lng,
      ]
    : [12.9716, 77.5946];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      scrollWheelZoom={true}
      className="real-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenter place={selectedPlace} />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[
            place.lat,
            place.lng,
          ]}
          eventHandlers={{
            click: () => onSelectPlace(place),
          }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{place.name}</strong>

              <p>{place.category}</p>

              <span>
                ⭐ {place.rating}
              </span>

              <br />

              <button
                onClick={() =>
                  onSelectPlace(place)
                }
              >
                Select Place
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;