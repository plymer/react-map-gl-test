import axios from "axios";
import { GEOMET_GETCAPABILITIES, GEOMET_GETMAP } from "../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { LayerDetails } from "../lib/types";
import { generateTimeSteps, parseTimes } from "../utilities/GeoMetSetup";

function useGeomet(layer: string) {
  // TODO:: we need to find a way to synchronize the timesteps in case the layers are mismatched (sometimes GOES-East data is 1 step ahead of WEST)

  // this function will handle the remainder of the parsing and creating of times and is called by react-query
  const parseTimeDetails = async () => {
    const data = await axios
      .get<string>(GEOMET_GETCAPABILITIES + layer)
      .then((response) => response.data);

    const details = parseTimes(data) as LayerDetails;

    const timeSteps = generateTimeSteps(
      details.timeStart,
      details.timeEnd,
      details.timeSlices,
    );

    const productURLs: string[] = [];
    timeSteps.forEach((t) => {
      productURLs.push(GEOMET_GETMAP + layer + "&time=" + t);
    });

    const output = { ...details, urls: productURLs };

    return output as LayerDetails;
  };

  return useQuery({
    queryKey: [layer],
    queryFn: parseTimeDetails,
    refetchInterval: 1 * 60 * 1000,
  });
}

export default useGeomet;
