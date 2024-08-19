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
import MapStatusBar from "./components/MapStatusBar";
import SatelliteLayer from "./components/SatelliteLayer";
import MapControlsBar from "./components/MapControlsBar";
import SynchroClock from "./components/SynchroClock";

// helpers
import { View } from "./utilities/types";
import { MAP_STYLE_URL } from "./utilities/constants";

// contexts
import { AnimationContextProvider } from "./contexts/animationContext";
import { ClockContextProvider } from "./contexts/clockContext";
import { SatelliteContextProvider } from "./contexts/satelliteContext";

// set the default values for the map centre and the zoom level
const defaultView: View = { lon: -113, lat: 53, zoom: 3 };

function App() {
    const getStyle = () => axios.get<StyleSpecification>(MAP_STYLE_URL).then((response) => response.data);

    const { data: style, isFetched: styleLoaded } = useQuery({
        queryKey: ["mapStyle"],
        queryFn: getStyle,
    });

    const [satProduct, setSatProduct] = useState("1km_DayCloudType-NightMicrophysics");
    const [isLoading, setIsLoading] = useState(false);
    const [coords, setCoords] = useState<number[]>();

    return (
        <>
            <SatelliteContextProvider>
                <ClockContextProvider>
                    <AnimationContextProvider>
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
                            {styleLoaded ? (
                                <>
                                    <SatelliteLayer satellite="GOES-West" subProduct={satProduct} />
                                    <SatelliteLayer satellite="GOES-East" subProduct={satProduct} />
                                </>
                            ) : (
                                ""
                            )}

                            <AttributionControl compact position="top-right" />
                        </Map>
                        <MapStatusBar center={coords} loadState={isLoading} />
                        <MapControlsBar />
                    </AnimationContextProvider>
                </ClockContextProvider>
            </SatelliteContextProvider>
        </>
    );
}

export default App;
