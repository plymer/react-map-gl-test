import { createContext, useMemo, useState } from "react";
import useContextWrapper from "../utilities/useContextWrapper";

export interface IAnimationContext {
    animationState: boolean; // isAnimating true/false
    setAnimationState: React.Dispatch<React.SetStateAction<IAnimationContext["animationState"]>>;
    animationFrame: number; // which frame is being displayed
    setAnimationFrame: React.Dispatch<React.SetStateAction<IAnimationContext["animationFrame"]>>;
    frameCount: number; // how many frames are in the animation
    setFrameCount: React.Dispatch<React.SetStateAction<IAnimationContext["frameCount"]>>;
    timeStart: number;
    setTimeStart: React.Dispatch<React.SetStateAction<IAnimationContext["timeStart"]>>;
    timeEnd: number;
    setTimeEnd: React.Dispatch<React.SetStateAction<IAnimationContext["timeEnd"]>>;
    currentTime: number;
    setCurrentTime: React.Dispatch<React.SetStateAction<IAnimationContext["currentTime"]>>;
    frameRate: number;
    setFrameRate: React.Dispatch<React.SetStateAction<IAnimationContext["frameRate"]>>;
}

export const AnimationContext = createContext<IAnimationContext | null>(null);

export const AnimationContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [animationState, setAnimationState] = useState<IAnimationContext["animationState"]>(false);
    const [animationFrame, setAnimationFrame] = useState<IAnimationContext["animationFrame"]>(0);
    const [frameCount, setFrameCount] = useState<IAnimationContext["frameCount"]>(0);
    const [timeStart, setTimeStart] = useState<IAnimationContext["timeStart"]>(0);
    const [timeEnd, setTimeEnd] = useState<IAnimationContext["timeEnd"]>(0);
    const [currentTime, setCurrentTime] = useState<IAnimationContext["currentTime"]>(Date.now());
    const [frameRate, setFrameRate] = useState<IAnimationContext["frameRate"]>(10);

    const value = useMemo(
        () => ({
            animationState,
            setAnimationState,
            animationFrame,
            setAnimationFrame,
            frameCount,
            setFrameCount,
            timeStart,
            setTimeStart,
            timeEnd,
            setTimeEnd,
            currentTime,
            setCurrentTime,
            frameRate,
            setFrameRate,
        }),
        [animationState, animationFrame, currentTime, frameRate]
    );

    return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
};

export const useAnimationContext = () =>
    useContextWrapper(AnimationContext, {
        contextName: useAnimationContext.name,
        providerName: AnimationContextProvider.name,
    });
