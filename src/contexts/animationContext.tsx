import { createContext, useMemo, useState } from "react";
import useContextWrapper from "../utilities/useContextWrapper";

export interface IAnimationContext {
  animationState: boolean; // isAnimating true/false
  setAnimationState: React.Dispatch<React.SetStateAction<IAnimationContext["animationState"]>>;
  currentFrame: number; // which frame is being displayed
  setCurrentFrame: React.Dispatch<React.SetStateAction<IAnimationContext["currentFrame"]>>;
  frameCount: number; // how many frames are in the animation
  setFrameCount: React.Dispatch<React.SetStateAction<IAnimationContext["frameCount"]>>;
  frameRate: number;
  setFrameRate: React.Dispatch<React.SetStateAction<IAnimationContext["frameRate"]>>;
  startTime: number;
  setStartTime: React.Dispatch<React.SetStateAction<IAnimationContext["startTime"]>>;
  endTime: number;
  setEndTime: React.Dispatch<React.SetStateAction<IAnimationContext["endTime"]>>;
}

export const AnimationContext = createContext<IAnimationContext | null>(null);

export const AnimationContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [animationState, setAnimationState] = useState<IAnimationContext["animationState"]>(false);
  const [frameCount, setFrameCount] = useState<IAnimationContext["frameCount"]>(18);
  const [currentFrame, setCurrentFrame] = useState<IAnimationContext["currentFrame"]>(frameCount - 1);
  const [frameRate, setFrameRate] = useState<IAnimationContext["frameRate"]>(5);
  const [startTime, setStartTime] = useState<IAnimationContext["startTime"]>(0);
  const [endTime, setEndTime] = useState<IAnimationContext["endTime"]>(Date.now());

  const value = useMemo(
    () => ({
      animationState,
      setAnimationState,
      currentFrame,
      setCurrentFrame,
      frameCount,
      setFrameCount,
      frameRate,
      setFrameRate,
      startTime,
      setStartTime,
      endTime,
      setEndTime,
    }),
    [animationState, currentFrame, frameRate, startTime, endTime]
  );

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
};

export const useAnimationContext = () =>
  useContextWrapper(AnimationContext, {
    contextName: useAnimationContext.name,
    providerName: AnimationContextProvider.name,
  });
