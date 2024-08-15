import { Source, Layer } from "react-map-gl/maplibre";
import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";

interface Props {
  time?: number;
  type: string;
  subProduct: string;
}

const WMSLayer = ({ time, type, subProduct }: Props) => {
  const wmsBaseURL =
    "https://geo.weather.gc.ca/geomet?service=WMS&version=1.3.0&request=GetMap&format=image/png&bbox={bbox-epsg-3857}&crs=EPSG:3857&width=256&height=256&layers=";

  // const wmsURL =
  // "https://geo.weather.gc.ca/geomet?service=WMS&version=1.3.0&request=GetMap&format=image/png&bbox={bbox-epsg-3857}&crs=EPSG:3857&width=256&height=256&layers=GOES-West_1km_DayCloudType-NightMicrophysics";

  if (type === "satellite") {
    console.log("adding satellite data");
  }

  const eastSource: RasterSource = {
    type: "raster",
    tiles: [wmsBaseURL + "GOES-East" + "_" + subProduct],
    tileSize: 256,
    bounds: [-100, -90, 180, 90],
  };

  const westSource: RasterSource = {
    type: "raster",
    tiles: [wmsBaseURL + "GOES-West" + "_" + subProduct],
    tileSize: 256,
    bounds: [-180, -90, -100, 90],
  };

  const eastLayer: RasterLayer = {
    id: "east-layer",
    type: "raster",
    paint: {},
    source: "eastSource",
    // @ts-ignore
    //  for some reason even through beforeId is defined in the layers.ts file and it works on the map, it is undefined in typescript
    beforeId: "wateroutline",
  };

  const westLayer: RasterLayer = {
    id: "west-layer",
    type: "raster",
    paint: {},
    source: "westSource",
    // @ts-ignore
    //  for some reason even through beforeId is defined in the layers.ts file and it works on the map, it is undefined in typescript
    beforeId: "wateroutline",
  };

  // TODO:: re-do this so that it creates just one source/layer pair so we can add two WMSLayer components to the app

  return (
    <>
      <Source {...eastSource}>
        <Layer key="0" {...eastLayer} />
      </Source>
      <Source {...westSource}>
        <Layer key="1" {...westLayer} />
      </Source>
    </>
  );
};

export default WMSLayer;
