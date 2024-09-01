import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl";

function recursiveMap(
  children: JSX.Element,
  fn: (element: React.ReactElement) => void,
) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props["children"] as React.ReactElement) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props["children"], fn),
      } as any);
    }

    return fn(child);
  });
}

interface Props {
  children: JSX.Element;
  layerToStackBeneath?: string;
}

const LayerManager = ({ children, layerToStackBeneath }: Props) => {
  const { current: map } = useMap();
  const layers: string[] = [];
  const layerIdsRef = useRef<string[]>(layers);
  const [mapLoaded, setMapLoaded] = useState(false);

  recursiveMap(children, (e) => {
    if (e.type["name"] === "Layer") {
      layers.push(e.props.id);
    }
  });

  useEffect(() => {
    map?.once("load", () => setMapLoaded(true));
  }, []);

  if (layerIdsRef.current === layers && mapLoaded) {
    // Timeout makes sure that the layers actually get added to the map before
    // moving
    setTimeout(() => {
      layers.forEach((id) => {
        const layer = map!.getLayer(id);
        if (!layer) return;
        map!.moveLayer(id, layerToStackBeneath);
      });
    }, 0);
    layerIdsRef.current = layers;
  }

  return <>{children}</>;
};

export default LayerManager;
