import axios from "axios";
import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

import MapStatusBar from "./components/MapStatusBar";
import SatelliteLayer from "./components/SatelliteLayer";
import MapControlsBar from "./components/MapControlsBar";
import { View } from "./utilities/types";
import { AttributionControl } from "react-map-gl";
import { AnimationContextProvider } from "./contexts/animationContext";
import SynchroClock from "./components/SynchroClock";

// set the default values for the map centre and the zoom level
const defaultView: View = { lon: -113, lat: 53, zoom: 3 };

function App() {
    const styleURL = "src/assets/map-styles/positronwxmap.json";
    const [style, setStyle] = useState("");
    const [satProduct, setSatProduct] = useState("1km_DayCloudType-NightMicrophysics");
    const [isLoading, setIsLoading] = useState(false);
    const [coords, setCoords] = useState<number[]>();

    // not sure if this is going to remain a thing
    // const times: LayerAnimationTime = { deltaTime: 10, startTime: 0, endTime: 20 };

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

        return () => {
            console.log("cleanup from app");
        };
    }, []);

    return (
        <>
            <AnimationContextProvider>
                <MapControlsBar />
                <SynchroClock />
                <Map
                    initialViewState={{
                        longitude: defaultView.lon,
                        latitude: defaultView.lat,
                        zoom: defaultView.zoom,
                    }}
                    attributionControl={false}
                    dragRotate={false}
                    pitchWithRotate={false}
                    touchPitch={false}
                    boxZoom={false}
                    style={{ width: "100%", height: "100vh" }}
                    mapStyle={style}
                    onLoad={
                        /* populate the map centre coords with the default values */
                        () => setCoords([defaultView.lon, defaultView.lat])
                    }
                    onData={
                        /* while data is loading, set our loading flag to 'on' */
                        () => setIsLoading(true)
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
                    <SatelliteLayer domain="west" subProduct={satProduct} />
                    <SatelliteLayer domain="east" subProduct={satProduct} />

                    <AttributionControl compact position="top-right" />
                </Map>
                <MapStatusBar center={coords} loadState={isLoading} />
            </AnimationContextProvider>
        </>
    );
}

export default App;
