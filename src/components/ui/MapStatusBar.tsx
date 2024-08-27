import { makeISOTimeStamp } from "../../utilities/GeoMetSetup";
import { useClockContext } from "../../contexts/clockContext";

import { LoadingSpinner } from "./LoadingSpinner";

import { FaGlobe } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";

interface Props {
    center?: number[];
    loadState: boolean;
}

const MapStatusBar = ({ center, loadState }: Props) => {
    const clockContext = useClockContext();

    return (
        <div className="absolute top-0 left-0 border-r border-b border-black bg-slate-900 text-white flex align-middle p-2 rounded-br-lg">
            {loadState ? (
                <LoadingSpinner className="w-6 h-6 inline-block border-t-slate-600 border-2 border-t-2" />
            ) : (
                <div className="w-6 h-6 inline-block"></div>
            )}
            <FaGlobe className="inline-block w-6 h-6 ms-2" />
            {center ? (
                <span className="mx-2 font-mono">
                    {Math.abs(parseFloat(center[1].toFixed(2)))}
                    {center[1] > 0 ? "°N" : "°S"} {Math.abs(parseFloat(center[0].toFixed(2)))}
                    {center[0] > 0 ? "°E" : "°W"}
                </span>
            ) : (
                ""
            )}
            <FaRegClock className="inline-block w-6 h-6 me-2" />
            <span className="font-mono">{makeISOTimeStamp(clockContext.time, "display")}</span>
        </div>
    );
};

export default MapStatusBar;
