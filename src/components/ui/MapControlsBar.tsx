import AnimationControls from "./AnimationControls";
import SatChannelSelector from "./SatChannelSelector";

const MapControlsBar = () => {
    return (
        <div className="absolute bottom-0 left-0 p-2 border-r border-b border-black bg-slate-900 text-white rounded-tr-lg">
            <AnimationControls />
            <SatChannelSelector />
        </div>
    );
};

export default MapControlsBar;
