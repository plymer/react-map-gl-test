import { useEffect, useState } from "react";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { LayerDetails } from "../../utilities/types";
import { GEOMET_GETMAP, GOES_EAST_BOUNDS, GOES_WEST_BOUNDS } from "../../utilities/constants";

import useSatellite from "../../hooks/useSatellite";
import { useSatelliteContext } from "../../contexts/satelliteContext";
import { useAnimationContext } from "../../contexts/animationContext";

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
        tileSize: 256,
        bounds: satellite === "GOES-West" ? GOES_WEST_BOUNDS : GOES_EAST_BOUNDS,
    };

    // const source: RasterSource = {
    //     type: "raster",
    //     tileSize: 256,
    //     bounds: satellite === "GOES-West" ? GOES_WEST_BOUNDS : GOES_EAST_BOUNDS,
    // };

    const layer: RasterLayer = {
        id: "layer-" + satellite,
        type: "raster",
        source: "source",
    };
    return (
        <Source {...source} key={satellite + subProduct}>
            <Layer {...layer} beforeId="wateroutline" paint={{}} />
        </Source>
    );

    // So, what if we made as many layers as there are time steps?
    // We want to first render the layer that displays on map load, and then shadow-load the other layers in the background,
    //    toggling on and off the layers as we animate. Data is cached this way, and there is no loading time for the actual animation.
    // The only issue I forsee with that is the hundred or so HTTP requests sent to the server at one time....... :grimmace emoji:

    // currently, this is only ending up requesting the 0th item in the URL array, possibly because the currentFrame is 0?
    // it is also NOT displaying the imagery on load, and only shows one timestep when you click through the timeseries
    // it is ALSO not mapping the currect currentFrame to the index
    // return layerInfo?.urls.map(
    //     (u, index) => (
    //         console.log(animationContext.currentFrame, index),
    //         (
    //             <Source {...source} key={index} tiles={[u]}>
    //                 <Layer
    //                     {...layer}

    //                     beforeId="wateroutline"
    //                     paint={{
    //                         "raster-fade-duration": 0,
    //                         "raster-opacity": index === animationContext.currentFrame ? 1 : 0,
    //                     }}
    //                 />
    //             </Source>
    //         )
    //     )
    // );
};

export default SatelliteLayer;
