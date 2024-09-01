import { useEffect, useState } from "react";
import type { RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { LayerDetails } from "../../utilities/types";
import {
  GOES_EAST_BOUNDS,
  GOES_WEST_BOUNDS,
  MAP_BOUNDS,
} from "../../utilities/constants";

import useGeoMet from "../../hooks/useGeoMet";
import { useGeoMetContext } from "../../contexts/geometContext";
import { useAnimationContext } from "../../contexts/animationContext";

interface Props {
  type: "satellite" | "radar";
  domain?: "west" | "east";
  product?: string;
  belowLayer?: string;
  initialized: boolean;
}

const GeoMetLayer = ({
  type,
  domain,
  product,
  belowLayer,
  initialized,
}: Props) => {
  const animation = useAnimationContext();
  const geoMet = useGeoMetContext();

  let geoMetSearchString: string = "";

  switch (type) {
    case "satellite":
      geoMetSearchString =
        domain === "west" ? "GOES-West_" + product : "GOES-East_" + product;
      break;
    case "radar":
      geoMetSearchString = "RADAR_1KM_" + product;
  }

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();

  const { data, fetchStatus, refetch } = useGeoMet(geoMetSearchString);

  const updateTimes = (times: LayerDetails) => {
    setLayerInfo(times);
    animation.setEndTime(times.timeEnd);
    animation.setStartTime(times.timeStart);
    animation.setTimeStep(times.timeDiff);
  };

  // this effect will update the satellite data whenever the data is refetched
  useEffect(() => {
    if (data) updateTimes(data);
  }, [fetchStatus]);

  // this effect is called whenever the subproduct changes from user input
  useEffect(() => {
    refetch();
  }, [geoMet]);

  const source: RasterSource = {
    type: "raster",
    tileSize: 256,
    bounds:
      type === "satellite"
        ? domain === "west"
          ? GOES_WEST_BOUNDS
          : GOES_EAST_BOUNDS
        : MAP_BOUNDS,
  };

  const layerId = domain ? "layer-" + type + "-" + domain : "layer-" + type;

  if (layerInfo) {
    if (initialized === false)
      return (
        <Source
          {...source}
          key={0}
          tiles={[layerInfo.urls[animation.currentFrame]]}
        >
          <Layer
            type="raster"
            source="source"
            id={layerId + "-0"}
            beforeId={belowLayer}
            paint={{
              "raster-fade-duration": 0, // this literally doesn't do anything
              "raster-opacity": 1,
            }}
          />
        </Source>
      );
    else
      return layerInfo.urls.map((u, index) => (
        <Source {...source} key={index} tiles={[u]}>
          <Layer
            type="raster"
            source="source"
            id={layerId + "-" + index}
            beforeId={belowLayer}
            paint={{
              "raster-fade-duration": 0, // this literally doesn't do anything
              "raster-opacity":
                index === animation.currentFrame ||
                index === animation.currentFrame - 1 ||
                (type === "satellite" && index === 0)
                  ? 1
                  : 0, // here, we want the current, the previous, and the very last frame to be preserved so that we don't get any flickering of the map background since the renderer does not repsect our fade-duration property
            }}
          />
        </Source>
      ));
  }
};

export default GeoMetLayer;
