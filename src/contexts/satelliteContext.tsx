import { createContext, useMemo, useState } from "react";
import useContextWrapper from "../utilities/useContextWrapper";

export interface ISatelliteContext {
    oldestTime: number; // storing in unix epoch time
    setOldestTime: React.Dispatch<React.SetStateAction<ISatelliteContext["oldestTime"]>>;
    newestTime: number; // storing in unix epoch time
    setNewestTime: React.Dispatch<React.SetStateAction<ISatelliteContext["newestTime"]>>;
    timeSteps: string[]; // storing in ISO date strings of YYYY-MM-DDTHH:mm:ssZ
    setTimeSteps: React.Dispatch<React.SetStateAction<ISatelliteContext["timeSteps"]>>;
}

export const SatelliteContext = createContext<ISatelliteContext | null>(null);

export const SatelliteContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [oldestTime, setOldestTime] = useState<ISatelliteContext["oldestTime"]>(0);
    const [newestTime, setNewestTime] = useState<ISatelliteContext["newestTime"]>(Date.now());
    const [timeSteps, setTimeSteps] = useState<ISatelliteContext["timeSteps"]>([""]);

    const value = useMemo(
        () => ({
            oldestTime,
            setOldestTime,
            newestTime,
            setNewestTime,
            timeSteps,
            setTimeSteps,
        }),
        [oldestTime]
    );

    return <SatelliteContext.Provider value={value}>{children}</SatelliteContext.Provider>;
};

export const useSatelliteContext = () =>
    useContextWrapper(SatelliteContext, {
        contextName: useSatelliteContext.name,
        providerName: SatelliteContextProvider.name,
    });
