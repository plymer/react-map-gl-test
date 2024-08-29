import { Switch } from "./switch";

const RadarSelector = () => {
  return (
    <div>
      <Switch
        id="radar-toggle"
        onCheckedChange={() => console.log("checked changed")}
      />
      <label htmlFor="radar-toggle">Show radar</label>
    </div>
  );
};

export default RadarSelector;
