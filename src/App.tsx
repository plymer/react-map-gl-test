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
import { ClockContextProvider } from "./contexts/clockContext";
import { useGeoMetContext } from "./contexts/geometContext";
import RadarLayer from "./components/data-layers/RadarLayer";

// set the default values for the map centre and the zoom level
const defaultView: View = { lon: -113, lat: 53, zoom: 3 };

function App() {
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
  const [coords, setCoords] = useState<number[]>();

  return (
    <>
      <Map
        initialViewState={{
          longitude: defaultView.lon,
          latitude: defaultView.lat,
          zoom: defaultView.zoom,
        }}
        // maxParallelImageRequests={128}
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
          () => {
            setCoords([defaultView.lon, defaultView.lat]);
            // console.log(e.target.getLayersOrder());
          }
        }
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
          () => {
            // console.log(e.target.getLayersOrder());
            setIsLoading(false);
          }
        }
        onMove={
          /* update our map-center lat-lon whenever we move the map view */
          (e) => setCoords([e.viewState.longitude, e.viewState.latitude])
        }
      >
        {geoMetContext.showRadar! === true ? (
          <RadarLayer geoMetSearchString={geoMetContext.radarProduct!} />
        ) : (
          ""
        )}

        <SatelliteLayer
          satellite="GOES-West"
          subProduct={geoMetContext.subProduct!}
        />
        <SatelliteLayer
          satellite="GOES-East"
          subProduct={geoMetContext.subProduct!}
        />

        <AttributionControl compact position="top-right" />
      </Map>

      <ClockContextProvider>
        <SynchroClock />
        <MapStatusBar center={coords} loadState={isLoading} />
      </ClockContextProvider>

      <MapControlsBar />
    </>
  );
}

export default App;
