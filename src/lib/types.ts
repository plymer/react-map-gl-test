export type View = { lon: number; lat: number; zoom: number };

export type DataParams = {
  timeStart: number;
  timeEnd: number;
  timeSlices: number;
  timeDiff: number;
  urls: string[];
};

export type LayerDetails = {
  name: string;
  type: string;
  domain: "west" | "east" | undefined;
  product: string | undefined;
  position: number;
};
