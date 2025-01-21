"use client";

import { CamSelector } from "@/components/myui/camselector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Webcam from "react-webcam";

export const dynamic = "force-dynamic";

export default function Home() {
  const [useDevices, setUseDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  const handleDevices = (device: MediaDeviceInfo) => {
    if (useDevices.map((device) => device.label).includes(device.label))
      setUseDevices(
        useDevices.filter((dev) => device.deviceId != dev.deviceId)
      );
    else setUseDevices(useDevices.concat([device]));
  };

  const handleAvailableDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  const getGridSize = () => {
    switch (Math.ceil(Math.sqrt(useDevices.length))) {
      case 1:
        return " grid-rows-1 grid-cols-1 ";
      case 2:
        return " grid-rows-2 grid-cols-2 ";
      case 3:
        return " grid-rows-3 grid-cols-3 ";
      default:
        return " grid-rows-0 grid-cols-0 ";
    }
  };

  const [modelData, setModelData] = React.useState<
    { camid: string; condition: string }[]
  >([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setModelData(data);
      // setModelData([])

      // const res = await fetch('/api/logs') // For logs
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleAvailableDevices);
  }, [handleAvailableDevices]);

  return (
    <div className="w-screen h-screen flex text-white">
      <div
        className={
          getGridSize() + ` grid w-4/5 bg-gray-900 transition-all duration-500 `
        }
      >
        {/* <div className="">IMC Underbody Sealant Detection through AI</div> */}
        {useDevices.length === 0 ? (
          <div className="flex justify-center items-center text-5xl font-black">
            No Selected Camera Device!
          </div>
        ) : useDevices.length > 9 ? (
          <div className="flex justify-center items-center text-5xl font-black">
            Can not display more that 9 video screens!
          </div>
        ) : (
          useDevices.map((device, key) => (
            <div className={`flex col-span-1 row-span-1 py-1`} key={key}>
              <Webcam
                className="h-full"
                audio={false}
                videoConstraints={{
                  deviceId: device.deviceId,
                  aspectRatio: screen.width / screen.height,
                }}
              />
            </div>
          ))
        )}
      </div>

      <div className="w-1/5 h-full flex flex-col items-center justify-between bg-gray-800 p-10 text-xl gap-y-2">
        <CamSelector
          className="flex justify-center items-center border h-8 w-full rounded-xl hover:bg-white hover:text-black transition-all hover:scale-110"
          devices={devices}
          handleDevices={handleDevices}
        />
        <div className="w-full h-1/2">
          <div className="flex flex-col items-center border h-full w-full rounded-xl my-2">
            Vehicle ID (Dummy)
            <Separator className="bg-gray-600" />
            --
            --
            --
          </div>
        </div>
        <div className="w-full h-1/2">
          <div className="flex flex-col items-center border h-full w-full rounded-xl my-2">
            Model Logs (Dummy)
            <Separator className="bg-gray-600" />
            <ScrollArea className="h-auto text-base w-full p-2">
              {
                //${new Date().toLocaleTimeString()}
                modelData?.length === 0 ? (
                  <div className="italic text-gray-400">No logs yet.</div>
                ) : (
                  modelData?.map(({ camid, condition }) => (
                    <div key={camid} className=" flex flex-col">
                      {`[${new Date().toLocaleTimeString()}] ` + camid}
                      <p
                        className={
                          (condition === "NG"
                            ? `text-red-500`
                            : `text-green-500`) +
                          ` flex items-center font-black`
                        }
                      >
                        {condition}
                      </p>
                      <Separator />
                    </div>
                  ))
                )
              }
              {/* <div>{JSON.stringify(modelData)}</div> */}
            </ScrollArea>
          </div>
        </div>
          {/* <button
            className="flex justify-center items-center border h-8 w-full rounded-xl hover:bg-white hover:text-black transition-all hover:scale-110"
            onClick={() => setUseDevices(useDevices.concat([devices[0]]))}
          >
            Test
          </button> */}
      </div>
    </div>
  );
}
