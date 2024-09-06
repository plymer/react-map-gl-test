import { SATELLITE_CHANNELS } from "@/lib/constants";

import { useGeoMetContext } from "@/contexts/geometContext";

const SatChannelSelector = () => {
  const satelliteContext = useGeoMetContext();

  return (
    <div>
      <label className="me-2" htmlFor="satchannelselector">
        Satellite Channel:
      </label>
      <select
        id="satchannelselector"
        defaultValue={satelliteContext.subProduct}
        onChange={(e) => satelliteContext.setSubProduct!(e.target.value)}
        className="rounded-sm text-black"
      >
        {SATELLITE_CHANNELS.map((ch, index) => (
          <option key={index} value={ch.wms}>
            {ch.menuName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SatChannelSelector;
