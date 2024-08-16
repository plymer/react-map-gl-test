import type { RasterLayer, RasterSource } from "react-map-gl/maplibre";
import { Layer, Source } from "react-map-gl/maplibre";

interface Props {
  time?: number;
  domain: "east" | "west";
  subProduct: string;
}

const SatelliteLayer = ({ time, domain, subProduct }: Props) => {
  var satelliteName = "";

  domain === "west" ? (satelliteName = "GOES-West") : (satelliteName = "GOES-East");

  const wmsBaseURL =
    "https://geo.weather.gc.ca/geomet?service=WMS&version=1.3.0&request=GetMap&format=image/png&bbox={bbox-epsg-3857}&crs=EPSG:3857&width=256&height=256&layers=";

  // const wmsURL =
  // "https://geo.weather.gc.ca/geomet?service=WMS&version=1.3.0&request=GetMap&format=image/png&bbox={bbox-epsg-3857}&crs=EPSG:3857&width=256&height=256&layers=GOES-West_1km_DayCloudType-NightMicrophysics";}

  const source: RasterSource = {
    type: "raster",
    tiles: [wmsBaseURL + satelliteName + "_" + subProduct],
    tileSize: 256,
    bounds: domain === "west" ? [-180, -90, -100, 90] : [-100, -90, 180, 90],
  };

  const layer: RasterLayer = {
    id: "layer-" + domain,
    type: "raster",
    paint: {},
    source: "source",
  };

  // TODO:: re-do this so that it creates just one source/layer pair so we can add two WMSLayer components to the app

  return (
    <>
      <Source {...source}>
        <Layer {...layer} beforeId="wateroutline" />
      </Source>
    </>
  );
};

export default SatelliteLayer;
