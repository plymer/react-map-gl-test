import { useEffect, useState } from "react";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { useAnimationContext } from "../contexts/animationContext";

import { LayerDetails } from "../utilities/types";
import { GEOMET_GETMAP, GOES_EAST_BOUNDS, GOES_WEST_BOUNDS } from "../utilities/constants";

import useSatellite from "../hooks/useSatellite";
import { useSatelliteContext } from "../contexts/satelliteContext";

interface Props {
    satellite: "GOES-West" | "GOES-East";
    subProduct: string;
}

const SatelliteLayer = ({ satellite, subProduct }: Props) => {
    const animationContext = useAnimationContext();
    const satelliteContext = useSatelliteContext();

    const [layerInfo, setLayerInfo] = useState<LayerDetails>();

    const { data: timeData, fetchStatus, refetch } = useSatellite(satellite, subProduct);

    const updateTimes = (times: LayerDetails) => {
        setLayerInfo(times);
        animationContext.setEndTime(times.timeEnd);
        animationContext.setStartTime(times.timeStart);
    };

    // this effect will update the satellite data whenever the data is refetched
    useEffect(() => {
        if (timeData) updateTimes(timeData);
    }, [fetchStatus]);

    // this effect is called whenever the subproduct changes from user input
    useEffect(() => {
        refetch();
    }, [satelliteContext]);

    const tileURL = layerInfo?.urls[animationContext.currentFrame];

    const source: RasterSource = {
        type: "raster",
        tiles: [tileURL || GEOMET_GETMAP + satellite + "_" + subProduct],
        // tiles: [GEOMET_GETMAP + "GOES-West" + "_" + subProduct, GEOMET_GETMAP + "GOES-East" + "_" + subProduct],
        tileSize: 256,
        bounds: satellite === "GOES-West" ? GOES_WEST_BOUNDS : GOES_EAST_BOUNDS,
    };

    const layer: RasterLayer = {
        id: "layer-" + satellite,
        type: "raster",
        paint: {},
        source: "source",
    };

    // So, what if we made as many layers as there are time steps?
    // We want to first render the layer that displays on map load, and then shadow-load the other layers in the background,
    //    toggling on and off the layers as we animate. Data is cached this way, and there is no loading time for the actual animation.
    // The only issue I forsee with that is the hundred or so HTTP requests sent to the server at one time....... :grimmace emoji:

    return (
        <>
            <Source {...source} key={"source_" + satellite}>
                <Layer {...layer} beforeId="wateroutline" />
            </Source>
        </>
    );
};

export default SatelliteLayer;
