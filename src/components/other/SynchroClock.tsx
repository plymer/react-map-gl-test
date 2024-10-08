import { useEffect } from "react";
import { useClockContext } from "../../contexts/clockContext";

/**
 *
 * @returns a dummy component that serves to synchronize the app data refresh
 */

const SynchroClock = () => {
  const clockContext = useClockContext();

  function waitUntil(start: number, update: number, updatePeriod: number) {
    // set the clock once we have mounted this component, which will cascade through the app
    clockContext.setTime(Date.now());
    const wait = 60000 + update - start;
    setTimeout(updateTime, wait, updatePeriod);
  }

  function updateTime(updatePeriod: number) {
    clockContext.setTime(Date.now());
    setInterval(() => clockContext.setTime(Date.now()), updatePeriod);
  }

  useEffect(() => {
    var updateTime: Date = new Date();
    const startTime: number = Date.now();
    updateTime.setSeconds(0);
    updateTime.setMilliseconds(0);
    const updateUnixTime: number = updateTime.getTime();

    waitUntil(startTime, updateUnixTime, 1000 * 60);
  }, []);

  return null;
};

export default SynchroClock;
