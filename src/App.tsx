// 3rd party libraries
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "react-map-gl/maplibre";
import { AttributionControl } from "react-map-gl";
import { StyleSpecification } from "maplibre-gl";

// css
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// components
import LightningLayer from "./components/data-layers/LightningLayer";
import GeoMetLayer from "./components/data-layers/GeoMetLayer";
import MapStatusBar from "./components/ui/MapStatusBar";
import MapControlsBar from "./components/ui/MapControlsBar";
import SynchroClock from "./components/SynchroClock";

// helpers
import { View } from "./utilities/types";
import { MAP_BOUNDS, MAP_STYLE_URL } from "./utilities/constants";

// contexts
import { ClockContextProvider } from "./contexts/clockContext";
import { useGeoMetContext } from "./contexts/geometContext";
import { useAnimationContext } from "./contexts/animationContext";

// set the default values for the map centre and the zoom level
const DEFAULT_VIEW: View = { lon: -95, lat: 53, zoom: 3.25 };

function App() {
  const geoMetContext = useGeoMetContext();
  const animation = useAnimationContext();

  const getStyle = () =>
    axios
      .get<StyleSpecification>(MAP_STYLE_URL)
      .then((response) => response.data);

  const { data: mapStyle } = useQuery({
    queryKey: ["mapStyle"],
    queryFn: getStyle,
  });

  // controls the state of the loading spinner
  const [isLoading, setIsLoading] = useState(false);

  // map viewstate is CONTROLLED in this app
  const [lat, setLat] = useState(DEFAULT_VIEW.lat);
  const [lon, setLon] = useState(DEFAULT_VIEW.lon);
  const [zoom, setZoom] = useState(DEFAULT_VIEW.zoom);

  return (
    <>
      <Map
        latitude={lat}
        longitude={lon}
        zoom={zoom}
        attributionControl={false}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        boxZoom={false}
        maxBounds={MAP_BOUNDS}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={mapStyle}
        onSourceData={() => {
          // we set our 'isLoading' flag to true any time one of the layers in the map is loading data
          // this allows us to show the loading spinner active
          setIsLoading(true);
        }}
        onIdle={() => {
          // we turn the loading spinner off when the map isn't doing anything
          setIsLoading(false);
          // this will only get called once the very first onIdle is called so that we can say that we have initialized the map with the first rendered images
          animation.animationState === "loading"
            ? animation.setAnimationState("playing")
            : "";
        }}
        onMove={
          /* update our map-center lat-lon and zoom whenever we move the map view */
          (e) => {
            animation.setAnimationState("paused");

            setLat(e.viewState.latitude);
            setLon(e.viewState.longitude);
            setZoom(e.viewState.zoom);
          }
        }
      >
        <LightningLayer belowLayer="wateroutline" />

        {geoMetContext.showRadar === true ? (
          <GeoMetLayer
            type="radar"
            product={geoMetContext.radarProduct}
            belowLayer="layer-lightning-0"
          />
        ) : (
          ""
        )}

        <GeoMetLayer
          type="satellite"
          product={geoMetContext.subProduct}
          domain="west"
          belowLayer="layer-radar-0"
        />
        <GeoMetLayer
          type="satellite"
          product={geoMetContext.subProduct}
          domain="east"
          belowLayer="layer-radar-0"
        />

        <AttributionControl compact position="top-right" />
      </Map>

      <ClockContextProvider>
        <SynchroClock />
        <MapStatusBar center={[lon, lat]} loadState={isLoading} />
      </ClockContextProvider>

      <MapControlsBar />
    </>
  );
}

export default App;
