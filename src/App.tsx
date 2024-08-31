// 3rd party libraries
import axios from "axios";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import { AttributionControl } from "react-map-gl";
import { StyleSpecification } from "maplibre-gl";

// css
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// components
import SatelliteLayer from "./components/data-layers/SatelliteLayer";
import MapStatusBar from "./components/ui/MapStatusBar";
import MapControlsBar from "./components/ui/MapControlsBar";
import SynchroClock from "./components/SynchroClock";

// helpers
import { View } from "./utilities/types";
import { MAP_BOUNDS, MAP_STYLE_URL } from "./utilities/constants";

// contexts
import { ClockContextProvider } from "./contexts/clockContext";
import { useGeoMetContext } from "./contexts/geometContext";
import RadarLayer from "./components/data-layers/RadarLayer";
import LightningLayer from "./components/data-layers/LightningLayer";

// set the default values for the map centre and the zoom level
const DEFAULT_VIEW: View = { lon: -113, lat: 53, zoom: 3 };

function App() {
  const mapRef = useRef<MapRef>(null);
  const geoMetContext = useGeoMetContext();

  const getStyle = () =>
    axios
      .get<StyleSpecification>(MAP_STYLE_URL)
      .then((response) => response.data);

  const { data: mapStyle } = useQuery({
    queryKey: ["mapStyle"],
    queryFn: getStyle,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [baseMapLoaded, setBaseMapLoaded] = useState(false);
  const [lat, setLat] = useState(DEFAULT_VIEW.lat);
  const [lon, setLon] = useState(DEFAULT_VIEW.lon);
  const [zoom, setZoom] = useState(DEFAULT_VIEW.zoom);

  return (
    <>
      <Map
        ref={mapRef}
        latitude={lat}
        longitude={lon}
        zoom={zoom}
        // maxParallelImageRequests={128}
        attributionControl={false}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        boxZoom={false}
        maxBounds={MAP_BOUNDS}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={mapStyle}
        // when the basemap has loaded, set the flag so we can proceed to begin adding our data layers to the map
        onLoad={() => setBaseMapLoaded(true)}
        onSourceData={
          /* while data is loading, set our loading flag to 'on' */
          () => {
            // console.log(e.dataType, e.originalEvent, e.target.areTilesLoaded());
            // console.log("tiles loaded:");
            setIsLoading(true);
          }
        }
        onIdle={
          /* while nothing is happening in the map, set our loading flag to 'off' */
          (e) => {
            setIsLoading(false);
          }
        }
        onMove={
          /* update our map-center lat-lon and zoom whenever we move the map view */
          (e) => {
            setLat(e.viewState.latitude);
            setLon(e.viewState.longitude);
            setZoom(e.viewState.zoom);
          }
        }
      >
        {baseMapLoaded ? (
          <LightningLayer before="wateroutline" />
        ) : (
          console.log(mapRef.current?.getLayer("wateroutline")?.sourceLayer)
        )}

        {geoMetContext.showRadar! === true &&
        mapRef.current?.getLayer("lightning0") ? (
          <RadarLayer
            geoMetSearchString={geoMetContext.radarProduct!}
            before="lightning0"
            // before="wateroutline"
          />
        ) : (
          ""
        )}

        {mapRef.current?.getLayer("layer-radar0") ? (
          <>
            <SatelliteLayer
              satellite="GOES-West"
              subProduct={geoMetContext.subProduct!}
              before="layer-radar0"
            />
            <SatelliteLayer
              satellite="GOES-East"
              subProduct={geoMetContext.subProduct!}
              before="layer-radar0"
            />
          </>
        ) : (
          ""
        )}

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
