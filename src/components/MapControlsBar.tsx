import { Stack } from "react-bootstrap";
import AnimationControls from "./AnimationControls";

const MapControlsBar = () => {
    return (
        <Stack direction="horizontal" className="map-controls-bar">
            <AnimationControls />
        </Stack>
    );
};

export default MapControlsBar;
