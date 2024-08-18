import { Spinner, Stack } from "react-bootstrap";
import PositionIndicator from "./PositionIndicator";
import { useAnimationContext } from "../contexts/animationContext";
import { makeISOTimeStamp } from "../utilities/GeoMetSetup";

interface Props {
    center?: number[];
    loadState: boolean;
}

const MapStatusBar = ({ center, loadState }: Props) => {
    const animationContext = useAnimationContext();

    return (
        <>
            <Stack direction="horizontal" className="map-status shadow">
                {loadState ? (
                    <Spinner animation="border" role="status" size="sm" className="mx-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <div className="mx-4 "></div>
                )}
                <PositionIndicator coords={center} />
                <span className="mx-4">{makeISOTimeStamp(animationContext.currentTime, "display")}</span>
            </Stack>
        </>
    );
};

export default MapStatusBar;
