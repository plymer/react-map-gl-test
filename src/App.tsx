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
import SatelliteLayer from "./components/data-layers/SatelliteLayer";
import MapStatusBar from "./components/ui/MapStatusBar";
import MapControlsBar from "./components/ui/MapControlsBar";
import SynchroClock from "./components/SynchroClock";

// helpers
import { View } from "./utilities/types";
import { MAP_BOUNDS, MAP_STYLE_URL } from "./utilities/constants";

// contexts
// import { useAnimationContext } from "./contexts/animationContext";
import { ClockContextProvider } from "./contexts/clockContext";
import { useSatelliteContext } from "./contexts/satelliteContext";

// set the default values for the map centre and the zoom level
const defaultView: View = { lon: -113, lat: 53, zoom: 3 };

function App() {
  const satelliteContext = useSatelliteContext();
  // const animationContext = useAnimationContext();

  const getStyle = () => axios.get<StyleSpecification>(MAP_STYLE_URL).then((response) => response.data);

  const { data: mapStyle } = useQuery({
    queryKey: ["mapStyle"],
    queryFn: getStyle,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<number[]>();

  return (
    <>
      <ClockContextProvider>
        <SynchroClock />
        <Map
          initialViewState={{
            longitude: defaultView.lon,
            latitude: defaultView.lat,
            zoom: defaultView.zoom,
          }}
          maxParallelImageRequests={128 /* this VASTLY improves loading performance */}
          attributionControl={false}
          dragRotate={false}
          pitchWithRotate={false}
          touchPitch={false}
          boxZoom={false}
          maxBounds={MAP_BOUNDS}
          style={{ width: "100%", height: "100vh" }}
          mapStyle={mapStyle}
          onLoad={
            /* populate the map centre coords with the default values */
            () => setCoords([defaultView.lon, defaultView.lat])
          }
          onData={
            /* while data is loading, set our loading flag to 'on' */
            () => {
              // console.log(e.target.areTilesLoaded());
              // console.log("tiles loaded:");
              setIsLoading(true);
            }
          }
          onIdle={
            /* while nothing is happening in the map, set our loading flag to 'off' */
            () => setIsLoading(false)
          }
          onMove={
            /* update our map-center lat-lon whenever we move the map view */
            (e) => setCoords([e.viewState.longitude, e.viewState.latitude])
          }
        >
          <SatelliteLayer satellite="GOES-West" subProduct={satelliteContext.subProduct} />
          <SatelliteLayer satellite="GOES-East" subProduct={satelliteContext.subProduct} />

          <AttributionControl compact position="top-right" />
        </Map>
        <MapStatusBar center={coords} loadState={isLoading} />
        <MapControlsBar />
      </ClockContextProvider>
    </>
  );
}

export default App;
