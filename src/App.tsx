// 3rd party libraries
import { useState } from "react";
import Map from "react-map-gl/maplibre";
import { AttributionControl } from "react-map-gl";
import { StyleSpecification } from "maplibre-gl";

// css
import "maplibre-gl/dist/maplibre-gl.css";

// map style
import basemap from "@/assets/map-styles/positronwxmap.json";

// components
// import LightningLayer from "@/components/data-layers/LightningLayer";
import GeoMetLayer from "@/components/data-layers/GeoMetLayer";
import MapStatusBar from "@/components/ui/MapStatusBar";
import SynchroClock from "@/components/other/SynchroClock";
import MapControls from "@/components/ui/MapControls";
import LayerList from "@/components/ui/LayerList";

// helpers
import { LayerDetails, View } from "@/lib/types";
import { MAP_BOUNDS } from "@/lib/constants";

// contexts
import { ClockContextProvider } from "@/contexts/clockContext";
import { useGeoMetContext } from "@/contexts/geometContext";
import { useAnimationContext } from "@/contexts/animationContext";

// set the default values for the map centre and the zoom level
const DEFAULT_VIEW: View = { lon: -95, lat: 53, zoom: 3.25 };

function App() {
  // set up the contexts required for data retrieval and animation of the map data
  const geoMetContext = useGeoMetContext();
  const animation = useAnimationContext();

  // contains all of the data layers that are loaded based on the map style defined in the 'basemap' JSON
  const [baseMapLayers, setBaseMapLayers] = useState<string[]>();
  // holds the ids of all of the layers that are currently being displayed on the map
  const [layers, setLayers] = useState<string[]>();
  // the configuration for programmatically adding and removing layers from the <Map> object below
  const [layerConfig, setLayerConfig] = useState<LayerDetails>();

  // controls the state of the loading spinner
  const [isLoading, setIsLoading] = useState(false);

  // map viewstate is CONTROLLED in this app
  const [lat, setLat] = useState(DEFAULT_VIEW.lat);
  const [lon, setLon] = useState(DEFAULT_VIEW.lon);
  const [zoom, setZoom] = useState(DEFAULT_VIEW.zoom);

  return (
    <>
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
        mapStyle={basemap as StyleSpecification}
        onStyleData={(e) => {
          // make sure we know what layers are in use by the basemap so that we can filter these out from our actual data layers that we are adding later
          // this should only fire on initial map load
          !baseMapLayers
            ? setBaseMapLayers(e.target.getLayersOrder())
            : setLayers(
                e.target
                  .getLayersOrder()
                  .filter((layer) => !baseMapLayers.includes(layer)),
              );
        }}
        onSourceData={(e) => {
          if (e.isSourceLoaded) {
            // console.log(e.target.getLayersOrder());
            console.log(e.sourceId, "completed loading");
          }
          setIsLoading(true);
          // we set our 'isLoading' flag to true any time one of the layers in the map is loading data
          // this allows us to show the loading spinner active
        }}
        onIdle={() => {
          // we turn the loading spinner off when the map isn't doing anything
          setIsLoading(false);

          // once no more source data is loading, allow the map to transistion to animating
          animation.animationState === "loading"
            ? animation.setAnimationState("playing")
            : "";
        }}
        onMove={
          /* update our map-center lat-lon and zoom whenever we move the map view */
          (e) => {
            setLat(e.viewState.latitude);
            setLon(e.viewState.longitude);
            setZoom(e.viewState.zoom);
          }
        }
        onClick={() => console.log(baseMapLayers)}
      >
        {geoMetContext.showRadar === true ? (
          <GeoMetLayer
            type="radar"
            product={geoMetContext.radarProduct}
            belowLayer="wateroutline"
          />
        ) : (
          ""
        )}

        <GeoMetLayer
          type="satellite"
          product={geoMetContext.subProduct}
          domain="west"
          belowLayer="wateroutline"
        />
        <GeoMetLayer
          type="satellite"
          product={geoMetContext.subProduct}
          domain="east"
          belowLayer="wateroutline"
        />

        <AttributionControl compact position="top-right" />
      </Map>

      <ClockContextProvider>
        <SynchroClock />
        <MapStatusBar center={[lon, lat]} loadState={isLoading} />
      </ClockContextProvider>

      <MapControls />
      <LayerList layerNames={layers} />
    </>
  );
}

export default App;
