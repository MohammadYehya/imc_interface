"use client";

import { CamSelector } from "@/components/myui/camselector";
import React from "react";
import Webcam from "react-webcam";


export default function Home() {
  const [useDevices, setUseDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  const handleDevices = (device : MediaDeviceInfo) => {
    if (useDevices.map(device => device.label).includes(device.label))
      setUseDevices(useDevices.filter(dev => device.label != dev.label))
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
      <div className="flex w-4/5 h-full bg-red-500 transition-all duration-500">
        {
          useDevices.map((device, key) => (
            <div className="" key={key}>
              <Webcam height={500} audio={false} videoConstraints={{ deviceId: device.deviceId }} />
            </div>
          ))
        }
      </div>

      <div className="w-1/5 h-full bg-blue-500">
        <CamSelector devices={devices} handleDevices={handleDevices}/>
      </div>
    </div>
  );
}

