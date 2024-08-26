import { CiGlobe } from "react-icons/ci";
import { Stack } from "react-bootstrap";

interface Props {
  coords?: number[] | null;
}

const PositionIndicator = ({ coords }: Props) => {
  return (
    <Stack direction="horizontal">
      {coords ? (
        <>
          <CiGlobe />
          <span className="ps-2">
            {Math.abs(parseFloat(coords[1].toFixed(2)))} {coords[1] > 0 ? "N" : "S"}
          </span>
          <span className="ps-2">
            {Math.abs(parseFloat(coords[0].toFixed(2)))} {coords[0] > 0 ? "E" : "W"}
          </span>
        </>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default PositionIndicator;
