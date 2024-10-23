"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { MapIcon } from "lucide-react";

import { SATELLITE_CHANNELS } from "@/config/satellite";
import { useGeoMetContext } from "@/contexts/geometContext";

export default function WeatherControls() {
  const geomet = useGeoMetContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="p-3">
            <MapIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-black bg-gray-800 text-white">
          <div className="mx-auto my-4 w-full max-w-sm">
            <Tabs defaultValue="satellite" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="satellite">Satellite</TabsTrigger>
                <TabsTrigger value="radar">Radar</TabsTrigger>
                <TabsTrigger value="overlays">Overlays</TabsTrigger>
              </TabsList>
              <TabsContent value="satellite" className="mt-4">
                <Select
                  defaultValue={geomet.subProduct}
                  onValueChange={(e) => geomet.setSubProduct!(e)}
                >
                  <SelectTrigger className="w-full text-black">
                    <SelectValue placeholder="Select Satellite Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {SATELLITE_CHANNELS.map((ch, index) => (
                      <SelectItem key={index} value={ch.wms}>
                        {ch.menuName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="radar" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="radar-switch">Radar</Label>
                  <Switch
                    id="radar-switch"
                    checked={geomet.showRadar}
                    onCheckedChange={(e) => geomet.setShowRadar!(e)}
                  />
                </div>
                <div className="flex items-center">
                  <Button
                    variant={
                      geomet.radarProduct === "RRAI" ? "default" : "outline"
                    }
                    onClick={() => geomet.setRadarProduct!("RRAI")}
                    className="w-full"
                  >
                    Rain
                  </Button>
                  <Button
                    variant={
                      geomet.radarProduct === "RSNO" ? "default" : "outline"
                    }
                    onClick={() => geomet.setRadarProduct!("RSNO")}
                    className="w-full"
                  >
                    Snow
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="overlays" className="mt-4 space-y-4">
                {[
                  "Lightning",
                  "Surface Observations",
                  "PIREPs",
                  "SIGMETs",
                  "AIRMETs",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item.toLowerCase().replace(/\s+/g, "-")} />
                    <Label htmlFor={item.toLowerCase().replace(/\s+/g, "-")}>
                      {item}
                    </Label>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
