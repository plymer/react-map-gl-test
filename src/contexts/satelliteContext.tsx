import { createContext, useMemo, useState } from "react";
import useContextWrapper from "../utilities/useContextWrapper";

export interface ISatelliteContext {
  subProduct: string;
  setSubProduct: React.Dispatch<React.SetStateAction<ISatelliteContext["subProduct"]>>;
}

export const SatelliteContext = createContext<ISatelliteContext | null>(null);

export const SatelliteContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [subProduct, setSubProduct] = useState<ISatelliteContext["subProduct"]>("1km_DayCloudType-NightMicrophysics");

  const value = useMemo(
    () => ({
      subProduct,
      setSubProduct,
    }),
    [subProduct]
  );

  return <SatelliteContext.Provider value={value}>{children}</SatelliteContext.Provider>;
};

export const useSatelliteContext = () =>
  useContextWrapper(SatelliteContext, {
    contextName: useSatelliteContext.name,
    providerName: SatelliteContextProvider.name,
  });
