import { useEffect } from "react";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { useClockContext } from "../contexts/clockContext";
import { GEOMET_GETMAP } from "../utilities/constants";

import { LayerAnimationTime } from "../utilities/types";

import useSatellite from "../hooks/useSatellite";
import { useSatelliteContext } from "../contexts/satelliteContext";
import { generateTimeSteps } from "../utilities/GeoMetSetup";

interface Props {
    satellite: "GOES-West" | "GOES-East";
    subProduct: string;
}

const SatelliteLayer = ({ satellite, subProduct }: Props) => {
    const satelliteContext = useSatelliteContext();
    const clockContext = useClockContext();

    let tileURL: string = "";

    const { data: timeData, isSuccess, isRefetching } = useSatellite(satellite, subProduct);

    const updateContext = (data: LayerAnimationTime) => {
        satelliteContext.setNewestTime(data.timeEnd);
        satelliteContext.setOldestTime(data.timeStart);

        // animationContext.setAnimationFrame(data.timeSlices - 1);
        satelliteContext.setTimeSteps(generateTimeSteps(data.timeStart, data.timeEnd, data.timeSlices));
        // animationContext.setTileURL(GEOMET_GETMAP + satellite + "_" + subProduct + "&time=" + animationContext.timeSteps[animationContext.animationFrame]);
        // console.log(data, animationContext.timeSteps[animationContext.animationFrame]);
    };

    // this triggers the first time that the time data for the layer has been retreived
    useEffect(() => {
        if (timeData) {
            updateContext(timeData);
        }
        return () => {};
    }, [isSuccess]);

    // use this to check every minute for new time data for the layer
    useEffect(() => {
        if (timeData && isRefetching) {
            // console.log("updating timeData at", makeISOTimeStamp(clockContext.time, "display"));
            updateContext(timeData);
        }

        return () => {};
    }, [clockContext.time]);

    // if (animationContext.timeSteps[animationContext.animationFrame] === undefined) {
    tileURL = GEOMET_GETMAP + satellite + "_" + subProduct;
    // } else {
    //     // console.log(satellite, animationContext.timeSteps[animationContext.animationFrame], animationContext.tileURL);
    //     tileURL = animationContext.tileURL;
    // }

    const source: RasterSource = {
        type: "raster",
        tiles: [tileURL],
        tileSize: 256,
        bounds: satellite === "GOES-West" ? [-180, -90, -100, 90] : [-100, -90, 180, 90],
    };

    const layer: RasterLayer = {
        id: "layer-" + satellite,
        type: "raster",
        paint: {},
        source: "source",
    };

    return (
        <>
            <Source {...source}>
                <Layer {...layer} beforeId="wateroutline" />
            </Source>
        </>
    );
};

export default SatelliteLayer;
