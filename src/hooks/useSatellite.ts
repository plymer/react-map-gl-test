import axios from "axios";
import { GEOMET_GETCAPABILITIES } from "../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { LayerAnimationTime } from "../utilities/types";
import { parseTimes } from "../utilities/GeoMetSetup";

const useSatellite = (satellite: string, subProduct: string) => {
    const getTimeSteps = () => axios.get<string>(GEOMET_GETCAPABILITIES + satellite + "_" + subProduct).then((response) => response.data);

    const parseTimeSteps = async () => {
        const data = await getTimeSteps();
        return parseTimes(data) as LayerAnimationTime;
    };

    return useQuery({
        queryKey: [satellite],
        queryFn: parseTimeSteps,
    });
};

export default useSatellite;
