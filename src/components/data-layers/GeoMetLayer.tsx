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
}

const GeoMetLayer = ({ type, domain, product, belowLayer }: Props) => {
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

  /*
  rules for smooth animation:
   1. absolutely NO tile source must change, otherwise the layer will dump the previous tiles and re-initialize new ones, leading to the checkerboard pattern and a poor UX. i do not believe this behaviour can be changed as it is inherent in both mapbox and maplibre.

  2. the previous frame must be rendered under the current frame in order to prevent the flickering of layers due to an inherent, unchangeable (as of 2024-09-02) 300ms fadeout for each layer. the property "raster-fade-duration" does not do anything as of this time.

  THE PROBLEM::
  - we are having a poor UX with this implementation because it is drawing the Zero'th layer first as it is loading all of the sources, which is fine if you are looking at 3-hour-old data by default
  - we need to figure out how to re-order the layers such that the animation.frameCount - 1'th layer is drawn at the top and updates first

  ------ what if we use a dummy layer with no data inside that we reference in the 'beforeId' section so that when the animationFrame is referenced the appropriate data is 'floated' to the top of the stack
              NOPE DOESNT WORK

-------  what if we split up the layerInfo.urls array at the index of the current frame, and then stick it back together with the current frame as the Zero'th item
              NOPE DOESNT WORK

------- what if we show a static layer when the map is not animating (i think we've tried this once before and it was ugly)
              THIS WORKS, BUT IS VERY SLOW / POOR UX (CHECKERBOARD)

------- what if we use a FRAME BUFFER approach (like the Finns do with their MeteoC weather map project)
              THIS BARELY WORKS, BUT IS HORRIBLY SLOW / TERRIBLE UX

------- what if we define a bunch of sources and then apply them to layers? I don't know if that works this way
              THIS IS WORKING INSOFAR AS IT ISNT THROWING MASSIVE ERRORS AND ITS LOOKING FOR THE RIGHT SOURCES ITS JUST NOT DRAWING ANYTHING


  */

  if (layerInfo) {
    return (
      <>
        {animation.animationState === ("paused" || "loading") ? (
          <Source
            {...source}
            key="0"
            tiles={[layerInfo.urls[animation.currentFrame]]}
          >
            <Layer
              type="raster"
              source="source"
              id={layerId + "-0"}
              beforeId={belowLayer}
            />
          </Source>
        ) : (
          layerInfo.urls.map((u, index) => (
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
          ))
        )}
      </>
    );
  }
};

export default GeoMetLayer;
