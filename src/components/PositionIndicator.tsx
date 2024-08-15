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
          <CiGlobe className="" />
          {coords[1]} N {coords[0]} W
        </>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default PositionIndicator;
