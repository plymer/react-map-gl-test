import { Loader2 } from "lucide-react";

interface Props {
  layerNames?: string[];
}

const LayerList = ({ layerNames }: Props) => {
  return (
    <div className="absolute bottom-0 right-0 bg-white p-8">
      <span>Layers:</span>
      {layerNames === undefined || layerNames.length === 0 ? (
        <Loader2 className="animate-spin" />
      ) : (
        layerNames.map((layer, index) => <div key={index}>{layer}</div>)
      )}
    </div>
  );
};

export default LayerList;
