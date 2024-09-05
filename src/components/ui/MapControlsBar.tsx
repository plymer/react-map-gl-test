import AnimationControls from "./AnimationControls";
import RadarSelector from "./RadarSelector";
import SatChannelSelector from "./SatChannelSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const MapControlsBar = () => {
  return (
    <div className="absolute bottom-0 left-0 grid grid-cols-2 rounded-tr-lg border-b border-r border-black bg-gray-800 p-2 text-white">
      <AnimationControls />
      <Tabs defaultValue="satellite" className="ms-2 inline-block">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="satellite">Satellite</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
        </TabsList>
        <TabsContent value="satellite">
          <SatChannelSelector />
        </TabsContent>
        <TabsContent value="radar">
          <RadarSelector />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapControlsBar;
