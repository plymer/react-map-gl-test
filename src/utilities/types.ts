export type View = { lon: number; lat: number; zoom: number };

export type LayerAnimationTime = {
    timeStart: number;
    timeEnd: number;
    timeSlices: number;
    timeDiff: number;
};

export type AnimationControls = "last" | "prev" | "play-pause" | "next" | "first";
