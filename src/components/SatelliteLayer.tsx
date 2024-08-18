import axios from "axios";
import { useEffect } from "react";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";
import { useAnimationContext } from "../contexts/animationContext";
import { GEOMET_GETCAPABILITIES, GEOMET_GETMAP } from "../utilities/constants";
import { generateTimeSteps, parseTimes } from "../utilities/GeoMetSetup";
import { LayerAnimationTime } from "../utilities/types";

interface Props {
    domain: "east" | "west";
    subProduct: string;
}

const SatelliteLayer = ({ domain, subProduct }: Props) => {
    var satelliteName = "";

    const animationContext = useAnimationContext();

    domain === "west" ? (satelliteName = "GOES-West") : (satelliteName = "GOES-East");

    const getTimes = async () => {
        var times: LayerAnimationTime = { timeDiff: 0, timeEnd: Date.now(), timeSlices: 1, timeStart: Date.now() };

        axios
            .get(GEOMET_GETCAPABILITIES + satelliteName + "_" + subProduct)
            .then((response) => {
                times = parseTimes(response.data) as LayerAnimationTime;
                if (times) {
                    animationContext.setTimeStart(times.timeStart);
                    animationContext.setTimeEnd(times.timeEnd);
                    animationContext.setFrameCount(times.timeSlices);
                    animationContext.setAnimationFrame(times.timeSlices - 1);
                    animationContext.setTimeSteps(generateTimeSteps(animationContext.timeStart, animationContext.timeEnd, animationContext.frameCount));
                    animationContext.setTileURL(GEOMET_GETMAP + satelliteName + "_" + subProduct + "&time=" + animationContext.timeSteps[animationContext.animationFrame]);
                    console.log("timestamp is:", animationContext.timeSteps[animationContext.animationFrame]);

                    // source.tiles = [animationContext.tileURL];
                }
            })
            .catch((error: Error) => {
                console.log(error.message);
            });
    };

    useEffect(() => {
        getTimes();

        // source.tiles = [tileURL];

        return () => {};
    }, [animationContext.currentTime]);

    // console.log("tileURL is set to: ", animationContext.tileURL);

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

    // source.tiles = [`${tileURL}`];

    // console.log(source.tiles);
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
