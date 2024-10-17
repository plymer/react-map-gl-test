import { useAnimationContext } from "@/contexts/animationContext";
import { MAP_BOUNDS } from "@/lib/constants";
import { useState } from "react";
import Map from "react-map-gl/maplibre";
import GeoMetLayer from "./GeoMetLayer";
import { useGeoMetContext } from "@/contexts/geometContext";

interface Props {
  lat: number;
  lon: number;
  zoom: number;
  type: "satellite" | "radar";
  domain?: "east" | "west";
}

export const WxMapContainer = ({ lat, lon, zoom, type, domain }: Props) => {
  const geoMetContext = useGeoMetContext();
  const animation = useAnimationContext();

  // controls the state of the loading spinner
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Map
      latitude={lat}
      longitude={lon}
      zoom={zoom}
      attributionControl={false}
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      boxZoom={false}
      maxBounds={MAP_BOUNDS}
      style={{ width: "100%", height: "100vh" }}
      onSourceData={() => {
        // we set our 'isLoading' flag to true any time one of the layers in the map is loading data
        // this allows us to show the loading spinner active
        setIsLoading(true);
      }}
      onIdle={() => {
        // we turn the loading spinner off when the map isn't doing anything
        setIsLoading(false);

        // once no more source data is loading, allow the map to transistion to animating
        animation.animationState === "loading"
          ? animation.setAnimationState("playing")
          : "";
      }}
    >
      <GeoMetLayer
        type={type}
        product={
          /* this only works for satellite and radar paradigm, have to build a more robust solution */
          type === "satellite"
            ? geoMetContext.subProduct
            : geoMetContext.radarProduct
        }
        domain={domain}
      />
    </Map>
  );
};
