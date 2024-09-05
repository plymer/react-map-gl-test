import Button from "./Button";

import { Switch } from "./Switch";
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
          className=""
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
          disabled={radar.radarProduct === "RRAI" ? true : false}
        >
          Rain
        </Button>
        <Button
          onClick={() => {
            changeRadarMode("snow");
          }}
          disabled={radar.radarProduct === "RSNO" ? true : false}
        >
          Snow
        </Button>
      </div>
    </div>
  );
};

export default RadarSelector;
