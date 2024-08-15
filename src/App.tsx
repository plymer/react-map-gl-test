import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import axios from "axios";
import { Spinner } from "react-bootstrap";

import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import PositionIndicator from "./components/PositionIndicator";

function App() {
  const styleURL = "src/assets/map-styles/positronwxmap.json";
  const [style, setStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<number[]>();

  const defaultView = [-113, 53, 8];

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
        style={{ width: "600px", height: "600px" }}
        mapStyle={style}
        onLoad={() => setCoords([defaultView[0], defaultView[1]])}
        onData={() => setIsLoading(true)}
        onIdle={() => setIsLoading(false)}
        onMove={(e) => setCoords([e.viewState.longitude, e.viewState.latitude])}
      />
      <PositionIndicator coords={coords} />
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        ""
      )}
    </>
  );
}

export default App;

