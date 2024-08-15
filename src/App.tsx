import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import axios from "axios";
import { Spinner, Stack } from "react-bootstrap";

import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import WMSLayer from "./components/WMSLayer";
import PositionIndicator from "./components/PositionIndicator";

function App() {
  const styleURL = "src/assets/map-styles/positronwxmap.json";
  const [style, setStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<number[]>();

  const defaultView = [-113, 53, 3];

  // grab the style sheet for the map display we are wanting to show
  useEffect(() => {
    axios
      .get(styleURL)
      .then((response) => {
        setStyle(response.data);
        // console.log(style);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Map
        initialViewState={{
          longitude: defaultView[0],
          latitude: defaultView[1],
          zoom: defaultView[2],
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={style}
        onLoad={/* populate the map centre coords */ () => setCoords([defaultView[0], defaultView[1]])}
        onData={/* while data is loading, set our loading flag to 'on' */ () => setIsLoading(true)}
        onIdle={/* while nothing is happening in the map, set our loading flag to 'off' */ () => setIsLoading(false)}
        onMove={
          /* update our map-center lat-lon whenever we move the map view */
          (e) => setCoords([e.viewState.longitude, e.viewState.latitude])
        }
      >
        <WMSLayer type="satellite" subProduct="1km_DayCloudType-NightMicrophysics" />
      </Map>
      <Stack direction="horizontal" className="map-status">
        <PositionIndicator coords={coords} />
        {isLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          ""
        )}
      </Stack>
    </>
  );
}

export default App;

