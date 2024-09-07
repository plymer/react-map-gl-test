import AnimationControls from "@/components/ui/AnimationControls";
import SiteSearch from "./SiteSearch";
import WeatherControls from "./WeatherControls";

const MapControls = () => {
  return (
    <div className="absolute bottom-0 left-0 flex justify-between rounded-tr-lg border-b border-r border-black bg-gray-800 px-2 text-white">
      <AnimationControls />
      <div className="ms-4 grid grid-cols-1 place-items-center">
        <WeatherControls />
        <SiteSearch />
      </div>
    </div>
  );
};

export default MapControls;
