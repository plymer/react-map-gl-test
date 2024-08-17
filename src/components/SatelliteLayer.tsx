import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";
import { parseTimes } from "../utilities/GeoMetSetup";
import { useAnimationContext } from "../contexts/animationContext";
import { useEffect } from "react";
import { GEOMET_GETCAPABILITIES, GEOMET_GETMAP } from "../utilities/constants";
import axios from "axios";

interface Props {
    domain: "east" | "west";
    subProduct: string;
}

const SatelliteLayer = ({ domain, subProduct }: Props) => {
    var satelliteName = "";

    const animationContext = useAnimationContext();

    domain === "west" ? (satelliteName = "GOES-West") : (satelliteName = "GOES-East");

    useEffect(() => {
        axios
            .get(GEOMET_GETCAPABILITIES + satelliteName + "_" + subProduct)
            .then((response) => {
                if (parseTimes(response.data)) {
                    const times = parseTimes(response.data);
                    if (times) {
                        animationContext.setTimeStart(times.timeStart);
                        animationContext.setTimeEnd(times.timeEnd);
                        animationContext.setFrameCount(times.timeSlices);
                    }
                }
            })
            .catch((error: Error) => {
                console.log(error.message);
            });

        animationContext.setCurrentTime(Date.now());
    }, []);

    const source: RasterSource = {
        type: "raster",
        tiles: [GEOMET_GETMAP + satelliteName + "_" + subProduct],
        tileSize: 256,
        bounds: domain === "west" ? [-180, -90, -100, 90] : [-100, -90, 180, 90],
    };

    const layer: RasterLayer = {
        id: "layer-" + domain,
        type: "raster",
        paint: {},
        source: "source",
    };

    // TODO:: re-do this so that it creates just one source/layer pair so we can add two WMSLayer components to the app

    return (
        <>
            <Source {...source}>
                <Layer {...layer} beforeId="wateroutline" />
            </Source>
        </>
    );
};

export default SatelliteLayer;
