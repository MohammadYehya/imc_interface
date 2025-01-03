"use client";

import { CamSelector } from "@/components/myui/camselector";
import React from "react";
import Webcam from "react-webcam";


export default function Home() {
  const [useDevices, setUseDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  const handleDevices = (device : MediaDeviceInfo) => {
    if (useDevices.map(device => device.label).includes(device.label))
      setUseDevices(useDevices.filter(dev => device.deviceId != dev.deviceId))
    else
      setUseDevices(useDevices.concat([device]))
  }

  const handleAvailableDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleAvailableDevices);
  }, [handleAvailableDevices]);

  return (
    <div className="w-screen h-screen flex">
      <div className={`grid grid-cols-12 grid-rows-12 w-4/5 bg-red-500 transition-all duration-500`}>
      {/* ${useDevices.length} */}
        {
          useDevices.map((device, key) => (
            <div className={`col-span-1 row-span-1 bg-green-500 border-r-black border-r-8`} key={key}>
              <Webcam className="h-full" audio={false} videoConstraints={{ deviceId: device.deviceId , aspectRatio: (screen.width/screen.height)}} />
            </div>
          ))
        }
      </div>

      <div className="w-1/5 h-full bg-blue-500">
        <CamSelector devices={devices} handleDevices={handleDevices}/>
        <button onClick={() => setUseDevices(useDevices.concat([devices[0]]))}>Test</button>
      </div>
    </div>
  );
}

