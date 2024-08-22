import { SATELLITE_CHANNELS } from "../utilities/constants";

import { useSatelliteContext } from "../contexts/satelliteContext";

const SatChannelSelector = () => {
  const satelliteContext = useSatelliteContext();

  return (
    <>
      <label htmlFor="satchannelselector">Satellite Channel:</label>
      <select
        id="satchannelselector"
        defaultValue={satelliteContext.subProduct}
        onChange={(e) => satelliteContext.setSubProduct(e.target.value)}
      >
        {SATELLITE_CHANNELS.map((ch, index) => (
          <option key={index} value={ch.wms}>
            {ch.menuName}
          </option>
        ))}
      </select>
    </>
  );
};

export default SatChannelSelector;
