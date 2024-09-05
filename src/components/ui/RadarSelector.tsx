import Button from "./Button";

import { Switch } from "./switch";
import { useGeoMetContext } from "@/contexts/geometContext";

const RadarSelector = () => {
  const radar = useGeoMetContext();

  const changeRadarMode = (mode: string) => {
    switch (mode) {
      case "rain":
        radar.setRadarProduct!("RRAI");
        break;
      case "snow":
        radar.setRadarProduct!("RSNO");
        break;
      default:
        console.log("no radar mode selected, somehow");
        return;
    }
  };

  return (
    <div className="flex flex-row justify-around">
      <div>
        <Switch
          className="data-[state=checked]:bg-teal-700"
          id="radar-toggle"
          checked={radar.showRadar}
          onCheckedChange={(e) => radar.setShowRadar!(e)}
        />
        <label htmlFor="radar-toggle" className="ms-2">
          Show Radar
        </label>
      </div>
      <div className="flex">
        <Button
          onClick={() => {
            changeRadarMode("rain");
          }}
          className="flex items-center justify-center rounded-none border border-black bg-teal-700 text-white first-of-type:rounded-s-md last-of-type:rounded-e-md hover:cursor-pointer hover:bg-teal-500"
        >
          Rain
        </Button>
        <Button
          onClick={() => {
            changeRadarMode("snow");
          }}
          className="flex items-center justify-center rounded-none border border-black bg-teal-700 text-white first-of-type:rounded-s-md last-of-type:rounded-e-md hover:cursor-pointer hover:bg-teal-500"
        >
          Snow
        </Button>
      </div>
    </div>
  );
};

export default RadarSelector;
