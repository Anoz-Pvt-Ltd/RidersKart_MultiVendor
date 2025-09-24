import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 28.6139, // Default (Delhi)
  lng: 77.209,
};

const MapInput = ({ className = "" }) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [place, setPlace] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setPlace(place);
      if (place.geometry) {
        setMapCenter(place.geometry.location.toJSON());
        setMarkerPosition(place.geometry.location.toJSON());
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search location"
          style={{ width: "400px", height: "40px", marginBottom: "10px" }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onClick={(e) =>
          setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        }
      >
        <Marker position={markerPosition} />
      </GoogleMap>

      <div style={{ marginTop: "10px" }} className={`${className}`}>
        <h3>Selected Location:</h3>
        <p>
          <strong>Coordinates:</strong> {markerPosition.lat},{" "}
          {markerPosition.lng}
        </p>
        <p>
          <strong>Details:</strong>{" "}
          {place?.formatted_address || "Click or search to select a location"}
        </p>
      </div>
    </LoadScript>
  );
};

export default MapInput;
