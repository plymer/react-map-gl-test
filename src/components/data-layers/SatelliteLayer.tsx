import { useEffect, useState } from "react";
import type { RasterSource } from "react-map-gl/maplibre";
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
  const animation = useAnimationContext();
  const satelliteContext = useSatelliteContext();

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();
  const [activeIndex, setActiveIndex] = useState<number>(animation.currentFrame);

  const { data: timeData, fetchStatus, refetch } = useSatellite(satellite, subProduct);

  const updateTimes = (times: LayerDetails) => {
    setLayerInfo(times);
    animation.setEndTime(times.timeEnd);
    animation.setStartTime(times.timeStart);
  };

  // this effect will update the satellite data whenever the data is refetched
  useEffect(() => {
    if (timeData) updateTimes(timeData);
  }, [fetchStatus]);

  // this effect is called whenever the subproduct changes from user input
  useEffect(() => {
    refetch();
  }, [satelliteContext]);

  useEffect(() => {
    setActiveIndex(animation.currentFrame);
  }, [animation.currentFrame]);

  const source: RasterSource = {
    type: "raster",
    tileSize: 256,
    bounds: satellite === "GOES-West" ? GOES_WEST_BOUNDS : GOES_EAST_BOUNDS,
  };

  return layerInfo?.urls.map((u, index) => (
    //   console.log("opacity:", checkOpacity(index)),
    <Source {...source} key={index} tiles={[u] || GEOMET_GETMAP + satellite + "_" + subProduct}>
      <Layer
        type="raster"
        source="source"
        id={"layer-" + satellite + index}
        beforeId="wateroutline"
        paint={{
          "raster-fade-duration": 0,
          "raster-opacity": index <= activeIndex ? 1 : 0,
        }}
      />
    </Source>
  ));
};

export default SatelliteLayer;
