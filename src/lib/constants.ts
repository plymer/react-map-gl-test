import { LngLatBoundsLike } from "maplibre-gl";

// map object constants
const MAX_WEST: number = -150;
const MAX_SOUTH: number = 30;
const MAX_EAST: number = -40;
const MAX_NORTH: number = 85;
const EAST_WEST_SPLIT: number = -110;
export const MAP_BOUNDS: LngLatBoundsLike & [number, number, number, number] = [
  MAX_WEST,
  MAX_SOUTH,
  MAX_EAST,
  MAX_NORTH,
];
export const GOES_EAST_BOUNDS: [number, number, number, number] = [
  EAST_WEST_SPLIT,
  MAX_SOUTH,
  MAX_EAST,
  MAX_NORTH,
];
export const GOES_WEST_BOUNDS: [number, number, number, number] = [
  MAX_WEST,
  MAX_SOUTH,
  EAST_WEST_SPLIT,
  MAX_NORTH,
];
export const RADAR_BOUNDS: [number, number, number, number] = [
  MAX_WEST,
  MAX_SOUTH,
  MAX_EAST,
  60,
];

export const MAP_TILE_CACHE_SIZE: number = 1024 * 1024 * 400; // in bytes

// settings for data layers
export const NUM_HRS_DATA: number = 3;
export const GEOMET_GETMAP: string =
  "https://geo.weather.gc.ca/geomet?service=WMS&version=1.3.0&request=GetMap&format=image/png&bbox={bbox-epsg-3857}&crs=EPSG:3857&width=256&height=256&LAYERS_REFRESH_RATE=PT1M&layers=";
export const GEOMET_GETCAPABILITIES: string =
  "https://geo.weather.gc.ca/geomet/?lang=en&service=WMS&request=GetCapabilities&version=1.3.0&LAYERS_REFRESH_RATE=PT1M&layers=";
