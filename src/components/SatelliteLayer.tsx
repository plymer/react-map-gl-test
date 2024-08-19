import { useEffect, useState } from "react";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

import { useClockContext } from "../contexts/clockContext";
import { useAnimationContext } from "../contexts/animationContext";

import { LayerDetails } from "../utilities/types";
import { GEOMET_GETMAP } from "../utilities/constants";

import useSatellite from "../hooks/useSatellite";

interface Props {
  satellite: "GOES-West" | "GOES-East";
  subProduct: string;
}

const SatelliteLayer = ({ satellite, subProduct }: Props) => {
  const animationContext = useAnimationContext();
  const clockContext = useClockContext();

  const [layerInfo, setLayerInfo] = useState<LayerDetails>();

  const { data: timeData, isSuccess, isRefetching } = useSatellite(satellite, subProduct);

  const updateTimes = (times: LayerDetails) => {
    setLayerInfo(times);
    animationContext.setEndTime(times.timeEnd);
    animationContext.setStartTime(times.timeStart);
  };

  useEffect(() => {
    if (timeData) updateTimes(timeData);
  }, []);

  useEffect(() => {
    if (timeData) updateTimes(timeData);
  }, [clockContext.time]);

  // HOLY SHIT THIS ACTUALLY WORKS

  const tileURL = layerInfo?.urls[animationContext.currentFrame];

  const source: RasterSource = {
    type: "raster",
    tiles: [tileURL || GEOMET_GETMAP + satellite + "_" + subProduct],
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
