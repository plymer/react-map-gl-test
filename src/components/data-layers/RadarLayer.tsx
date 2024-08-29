// import { GEOMET_GETMAP } from "@/utilities/constants";
import { useAnimationContext } from "../../contexts/animationContext";

import { useEffect, useState } from "react";
import type { RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { LayerDetails } from "../../utilities/types";
import useGeoMet from "@/hooks/useGeoMet";
import { RADAR_BOUNDS } from "@/utilities/constants";
import { useGeoMetContext } from "@/contexts/geometContext";

interface Props {
  geoMetSearchString: string;
}

const RadarLayer = ({ geoMetSearchString }: Props) => {
  const animation = useAnimationContext();
  const radar = useGeoMetContext();

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();
  //   const [product, setProduct] = useState<string>(precipType);

  //   const { data, fetchStatus } = useGeoMet(geoMetSearchString);

  const { data, fetchStatus, refetch } = useGeoMet(geoMetSearchString);

  // this effect will update the satellite data whenever the data is refetched
  useEffect(() => {
    if (data) {
      setLayerInfo(data);
    }
  }, [fetchStatus]);

  // this effect is called whenever the subproduct changes from user input
  useEffect(() => {
    refetch();
  }, [radar]);

  const source: RasterSource = {
    type: "raster",
    tileSize: 256,
    bounds: RADAR_BOUNDS,
  };

  //   if (animation.animationState) {
  return layerInfo?.urls.map((u, index) => (
    <Source {...source} key={index} tiles={[u]}>
      <Layer
        type="raster"
        source="source"
        id={"layer-radar" + index}
        beforeId="wateroutline"
        paint={{
          "raster-fade-duration": 0, // this literally doesn't do anything
          "raster-opacity":
            index === animation.currentFrame ||
            index === animation.currentFrame - 1
              ? 1
              : 0,
        }}
      />
    </Source>
  ));
  //   } else {
  //     return (
  //       <Source
  //         {...source}
  //         key={0}
  //         tiles={[
  //           layerInfo?.urls[animation.currentFrame] ||
  //             GEOMET_GETMAP + geoMetSearchString,
  //         ]}
  //       >
  //         <Layer
  //           type="raster"
  //           source="source"
  //           id={"layer-radar0"}
  //           beforeId="wateroutline"
  //           paint={{
  //             "raster-fade-duration": 0, // this literally doesn't do anything
  //           }}
  //         />
  //       </Source>
  //     );
  //   }
};

export default RadarLayer;
