import { useEffect, useState } from "react";
import type { RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { LayerDetails } from "../../utilities/types";
import { GOES_EAST_BOUNDS, GOES_WEST_BOUNDS } from "../../utilities/constants";

import useGeoMet from "../../hooks/useGeoMet";
import { useGeoMetContext } from "../../contexts/geometContext";
import { useAnimationContext } from "../../contexts/animationContext";

interface Props {
  satellite: "GOES-West" | "GOES-East";
  subProduct: string;
  before: string;
}

const SatelliteLayer = ({ satellite, subProduct, before }: Props) => {
  const animation = useAnimationContext();
  const satelliteContext = useGeoMetContext();

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();

  const {
    data: timeData,
    fetchStatus,
    refetch,
  } = useGeoMet(satellite + "_" + subProduct);

  const updateTimes = (times: LayerDetails) => {
    setLayerInfo(times);
    animation.setEndTime(times.timeEnd);
    animation.setStartTime(times.timeStart);
    animation.setTimeStep(times.timeDiff);
  };

  // this effect will update the satellite data whenever the data is refetched
  useEffect(() => {
    if (timeData) updateTimes(timeData);
  }, [fetchStatus]);

  // this effect is called whenever the subproduct changes from user input
  useEffect(() => {
    refetch();
  }, [satelliteContext]);

  const source: RasterSource = {
    type: "raster",
    tileSize: 256,
    bounds: satellite === "GOES-West" ? GOES_WEST_BOUNDS : GOES_EAST_BOUNDS,
  };

  // const currentTiles = layerInfo?.urls[animation.currentFrame];

  // if (animation.animationState) {
  return layerInfo?.urls.map((u, index) => (
    <Source {...source} key={index} tiles={[u]}>
      <Layer
        type="raster"
        source="source"
        id={"layer-" + satellite + index}
        beforeId={before}
        paint={{
          "raster-fade-duration": 0, // this literally doesn't do anything
          "raster-opacity":
            index === animation.currentFrame ||
            index === animation.currentFrame - 1 ||
            index === 0
              ? 1
              : 0, // here, we want the current, the previous, and the very last frame to be preserved so that we don't get any flickering of the map background since the renderer does not repsect our fade-duration property
        }}
      />
    </Source>
  ));
  // } else {
  //   return (
  //     <Source
  //       {...source}
  //       key={0}
  //       tiles={[
  //         layerInfo?.urls[animation.currentFrame] ||
  //           GEOMET_GETMAP + satellite + "_" + subProduct,
  //       ]}
  //     >
  //       <Layer
  //         type="raster"
  //         source="source"
  //         id={"layer-" + satellite}
  //         beforeId="layer-radar0"
  //         paint={{
  //           "raster-fade-duration": 0, // this literally doesn't do anything
  //         }}
  //       />
  //     </Source>
  //   );
  // }
};

export default SatelliteLayer;
