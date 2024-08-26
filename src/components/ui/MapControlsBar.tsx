import { Stack } from "react-bootstrap";
import AnimationControls from "./AnimationControls";
import SatChannelSelector from "./SatChannelSelector";

const MapControlsBar = () => {
    return (
        <Stack direction="horizontal" className="map-controls-bar map-ui border-round-tr">
            <AnimationControls />
            <SatChannelSelector />
        </Stack>
    );
};

export default MapControlsBar;
