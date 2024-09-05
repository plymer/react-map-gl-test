import { makeISOTimeStamp } from "../../utilities/geoMetSetup";
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
    <div className="absolute left-0 top-0 flex rounded-br-lg border-b border-r border-black bg-gray-800 p-2 align-middle text-white">
      {loadState ? (
        <LoadingSpinner className="inline-block h-6 w-6 border-2 border-t-2 border-t-slate-600" />
      ) : (
        <div className="inline-block h-6 w-6"></div>
      )}
      <FaGlobe className="ms-2 inline-block h-6 w-6" />
      {center ? (
        <span className="mx-2 font-mono">
          {Math.abs(parseFloat(center[1].toFixed(2)))}
          {center[1] > 0 ? "°N" : "°S"}{" "}
          {Math.abs(parseFloat(center[0].toFixed(2)))}
          {center[0] > 0 ? "°E" : "°W"}
        </span>
      ) : (
        ""
      )}
      <FaRegClock className="me-2 inline-block h-6 w-6" />
      <span className="font-mono">
        {makeISOTimeStamp(clockContext.time, "display")}
      </span>
    </div>
  );
};

export default MapStatusBar;
