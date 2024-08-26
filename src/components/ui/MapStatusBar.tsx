import { Spinner, Stack } from "react-bootstrap";

import { makeISOTimeStamp } from "../../utilities/GeoMetSetup";
import { useClockContext } from "../../contexts/clockContext";
import PositionIndicator from "./PositionIndicator";

interface Props {
    center?: number[];
    loadState: boolean;
}

const MapStatusBar = ({ center, loadState }: Props) => {
    const clockContext = useClockContext();

    return (
        <>
            <Stack direction="horizontal" className="map-status shadow map-ui border-round-br">
                {loadState ? (
                    <Spinner animation="border" role="status" size="sm" className="mx-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <div className="mx-4 "></div>
                )}
                <PositionIndicator coords={center} />
                <span className="mx-4">{makeISOTimeStamp(clockContext.time, "display")}</span>
            </Stack>
        </>
    );
};

export default MapStatusBar;
