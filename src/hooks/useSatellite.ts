import axios from "axios";
import { GEOMET_GETCAPABILITIES, GEOMET_GETMAP } from "../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { LayerDetails } from "../utilities/types";
import { generateTimeSteps, parseTimes } from "../utilities/GeoMetSetup";

// we need to build this to be able to return ALL of the relevant information about start/end times,
//    as well as all of the available timesteps, and create the URLs to retrieve the data
// we will store this in a context but we won't have a getter/setter for each to reduce the complexity since this
//   operation will be pretty quick just based on the GETCAPABILITIES run
const useSatellite = (satellite: string, subProduct: string) => {
  // xml data from the geomet server starts the chain of events
  const getTimeInfo = () =>
    axios.get<string>(GEOMET_GETCAPABILITIES + satellite + "_" + subProduct).then((response) => response.data);

  // this function will handle the remainder of the parsing and creating of times and is called by react-query
  const parseTimeDetails = async () => {
    const data = await getTimeInfo();
    const details = parseTimes(data) as LayerDetails;

    const timeSteps = generateTimeSteps(details.timeStart, details.timeEnd, details.timeSlices);

    const productURLs: string[] = [];
    timeSteps.forEach((t) => {
      productURLs.push(GEOMET_GETMAP + satellite + "_" + subProduct + "&time=" + t);
    });

    const output = { ...details, urls: productURLs };

    // console.log(output);

    return output as LayerDetails;
  };

  return useQuery({
    queryKey: [satellite],
    queryFn: parseTimeDetails,
    refetchInterval: 1 * 60 * 1000,
  });
};

export default useSatellite;
