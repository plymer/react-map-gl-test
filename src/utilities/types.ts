export type View = { lon: number; lat: number; zoom: number };

export type LayerDetails = {
    timeStart: number;
    timeEnd: number;
    timeSlices: number;
    timeDiff: number;
    urls: string[];
};

export type AnimationControls = "last" | "prev" | "play-pause" | "next" | "first";
