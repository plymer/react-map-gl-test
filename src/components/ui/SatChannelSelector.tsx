import { SATELLITE_CHANNELS } from "../../utilities/constants";

import { useSatelliteContext } from "../../contexts/satelliteContext";

const SatChannelSelector = () => {
    const satelliteContext = useSatelliteContext();

    return (
        <div>
            <label className="me-2" htmlFor="satchannelselector">
                Satellite Channel:
            </label>
            <select
                id="satchannelselector"
                defaultValue={satelliteContext.subProduct}
                onChange={(e) => satelliteContext.setSubProduct(e.target.value)}
                className="text-black rounded-sm"
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
