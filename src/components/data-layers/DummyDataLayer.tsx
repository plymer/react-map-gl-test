/**
 * This component holds an empty Source + Layer combo that allows us to 'hold' the position of the "parent" data layer
 *   in the case that we need to turn it off and then on again. This is because we are not allowed to re-order the layers
 *   without knowing a lot of on-the-fly state. This might be redundant later in the future, but this is quick and dirty
 *   and, most importantly, it works.
 */

import { Layer, Source } from "react-map-gl";

interface Props {
  id: string;
  belowLayer: string;
}

const DummyDataLayer = ({ id, belowLayer }: Props) => {
  return (
    <Source type="vector" id={id}>
      <Layer
        type="circle"
        source="source"
        source-layer="wateroutline"
        id={id}
        beforeId={belowLayer}
      />
    </Source>
  );
};

export default DummyDataLayer;
