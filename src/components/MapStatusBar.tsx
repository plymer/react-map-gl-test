import { Spinner, Stack } from "react-bootstrap";
import PositionIndicator from "./PositionIndicator";

interface Props {
  center?: number[];
  loadState: boolean;
}

const MapStatusBar = ({ center, loadState }: Props) => {
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
      </Stack>
    </>
  );
};

export default MapStatusBar;
