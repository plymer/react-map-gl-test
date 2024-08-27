import axios from "axios";
import { GEOMET_GETCAPABILITIES, GEOMET_GETMAP } from "../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { LayerDetails } from "../utilities/types";
import { generateTimeSteps, parseTimes } from "../utilities/GeoMetSetup";

function useSatellite(satellite: string, subProduct: string) {
    // TODO:: we need to find a way to synchronize the timesteps in case the layers are mismatched (sometimes GOES-East data is 1 step ahead of WEST)

    // this function will handle the remainder of the parsing and creating of times and is called by react-query
    const parseTimeDetails = async () => {
        const data = await axios.get<string>(GEOMET_GETCAPABILITIES + satellite + "_" + subProduct).then((response) => response.data);
        const details = parseTimes(data) as LayerDetails;

        const timeSteps = generateTimeSteps(details.timeStart, details.timeEnd, details.timeSlices);

        const productURLs: string[] = [];
        timeSteps.forEach((t) => {
            productURLs.push(GEOMET_GETMAP + satellite + "_" + subProduct + "&time=" + t);
        });

        const output = { ...details, urls: productURLs };

        return output as LayerDetails;
    };

    return useQuery({
        queryKey: [satellite],
        queryFn: parseTimeDetails,
        refetchInterval: 1 * 60 * 1000,
    });
}

export default useSatellite;
