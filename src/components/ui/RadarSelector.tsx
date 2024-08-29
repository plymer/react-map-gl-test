import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";
import { useGeoMetContext } from "@/contexts/geometContext";

const RadarSelector = () => {
  const radar = useGeoMetContext();

  return (
    <div className="flex flex-row justify-between">
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
      <RadioGroup defaultValue="RADAR_1KM_RRAI">
        <div className="">
          <RadioGroupItem
            value={"RADAR_1KM_RRAI"}
            id="rain"
            className="bg-teal-700"
          />
          <label htmlFor="rain">Rain</label>
        </div>
        <div className="">
          <RadioGroupItem
            value={"RADAR_1KM_RSNO"}
            id="snow"
            className="bg-teal-700"
          />
          <label htmlFor="snow">Snow</label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadarSelector;
