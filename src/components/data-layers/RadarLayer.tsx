import { GEOMET_GETMAP } from "@/utilities/constants";
import { useAnimationContext } from "../../contexts/animationContext";

import { useEffect, useState } from "react";
import type { RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { LayerDetails } from "../../utilities/types";
import useGeoMet from "@/hooks/useGeoMet";

interface Props {
  precipType: "rain" | "snow";
}

const RadarLayer = ({ precipType }: Props) => {
  const animation = useAnimationContext();

  const geoMetSearchString =
    precipType === "rain" ? "RADAR_1KM_RRAI" : "RADAR_1KM_RSNO";

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();

  const { data, fetchStatus, refetch } = useGeoMet(geoMetSearchString);

  // this effect will update the satellite data whenever the data is refetched
  useEffect(() => {
    if (data) {
      setLayerInfo(data);
    }
  }, [fetchStatus]);

  const source: RasterSource = {
    type: "raster",
    tileSize: 256,
  };

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
};

export default RadarLayer;
