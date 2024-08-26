import { SATELLITE_CHANNELS } from "../../utilities/constants";

import { useSatelliteContext } from "../../contexts/satelliteContext";
import { Stack } from "react-bootstrap";

const SatChannelSelector = () => {
    const satelliteContext = useSatelliteContext();

    return (
        <Stack direction="vertical" className="d-flex align-items-center me-2">
            <label htmlFor="satchannelselector">Satellite Channel:</label>
            <select id="satchannelselector" defaultValue={satelliteContext.subProduct} onChange={(e) => satelliteContext.setSubProduct(e.target.value)}>
                {SATELLITE_CHANNELS.map((ch, index) => (
                    <option key={index} value={ch.wms}>
                        {ch.menuName}
                    </option>
                ))}
            </select>
        </Stack>
    );
};

export default SatChannelSelector;
