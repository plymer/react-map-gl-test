// 2024.09.05 -- this will eventually be rolled into a generalized 'point data' layer and fed live data
//            -- need to incorporate turf library to draw properly-sized circles of spatial dimensions

// [data-driven styling](https://maplibre.org/maplibre-gl-js/docs/examples/data-driven-lines/)
// [expressions for data-driven styling](https://maplibre.org/maplibre-style-spec/expressions/#match)

import { Layer, Source } from "react-map-gl";
// import * as json from "../../assets/station-data/lightning.json";

interface Props {
  belowLayer?: string;
}

const LightningLayer = ({ belowLayer }: Props) => {
  // dummy data
  const geoJson = {
    features: [
      {
        geometry: {
          coordinates: [
            [-75.1148, 37.9284],
            [-90.757, 41.4454],
            [-75.5813, 37.8648],
            [-89.1715, 41.7784],
            [-72.4251, 37.5026],
            [-73.9761, 38.456],
            [-74.7204, 37.6885],
            [-74.4072, 37.8146],
            [-74.0634, 38.2215],
            [-74.7172, 37.8129],
            [-72.2144, 37.5211],
            [-74.5002, 37.92],
            [-71.9057, 37.1151],
            [-73.969, 38.3157],
            [-74.8114, 37.7704],
            [-88.7862, 41.9971],
          ],
          type: "MultiPoint",
        },
        properties: {},
        type: "Feature",
      },
    ],
    type: "FeatureCollection",
  };

  return (
    <Source type="geojson" id="lightning" data={geoJson}>
      <Layer
        type="circle"
        beforeId={belowLayer}
        id="layer-lightning-0"
        paint={{
          "circle-radius": 10,
          "circle-color": "rgba(255,0,0, 0)",
          "circle-stroke-color": "rgb(255,0,0)",
          "circle-stroke-width": 2,
        }}
      />
    </Source>
  );
};

export default LightningLayer;
