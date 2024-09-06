import { createContext, useMemo, useState } from "react";
import useContextWrapper from "@/hooks/useContextWrapper";

export interface IGeoMetContext {
  subProduct?: string;
  setSubProduct?: React.Dispatch<
    React.SetStateAction<IGeoMetContext["subProduct"]>
  >;
  radarProduct?: string;
  setRadarProduct?: React.Dispatch<
    React.SetStateAction<IGeoMetContext["radarProduct"]>
  >;
  showRadar?: boolean;
  setShowRadar?: React.Dispatch<
    React.SetStateAction<IGeoMetContext["showRadar"]>
  >;
}

export const GeoMetContext = createContext<IGeoMetContext | null>(null);

export const GeoMetContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [subProduct, setSubProduct] = useState<IGeoMetContext["subProduct"]>(
    "1km_DayCloudType-NightMicrophysics",
  );

  const [radarProduct, setRadarProduct] =
    useState<IGeoMetContext["radarProduct"]>("RRAI");

  const [showRadar, setShowRadar] = useState<IGeoMetContext["showRadar"]>(true);

  const value = useMemo(
    () => ({
      subProduct,
      setSubProduct,
      radarProduct,
      setRadarProduct,
      showRadar,
      setShowRadar,
    }),
    [subProduct, radarProduct, showRadar],
  );

  return (
    <GeoMetContext.Provider value={value}>{children}</GeoMetContext.Provider>
  );
};

export const useGeoMetContext = () =>
  useContextWrapper(GeoMetContext, {
    contextName: useGeoMetContext.name,
    providerName: GeoMetContextProvider.name,
  });
