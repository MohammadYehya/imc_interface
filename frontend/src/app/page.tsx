"use client";

import { CamSelector } from "@/components/myui/camselector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Webcam from "react-webcam";
import React from "react";
import { ErrorPopup } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface WebcamInfo{
  MediaData: MediaDeviceInfo;
  WebcamRef: React.RefObject<Webcam | null>;
}

export default function Home() {
  const [useDevices, setUseDevices] = React.useState<WebcamInfo[]>([]);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [modelData, setModelData] = React.useState([]);

  const handleDevices = (device: MediaDeviceInfo) => {
    if (useDevices.map((dev) => dev.MediaData.label).includes(device.label))
      setUseDevices(
        useDevices.filter((dev) => device.deviceId != dev.MediaData.deviceId)
      );
    else setUseDevices(useDevices.concat([{MediaData: device, WebcamRef: React.createRef()}]))
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

  const fetchData = async (device: WebcamInfo) => {
    // const res = x%2 === 0 ? await fetch("/api/predict") : await fetch("/api/test");
    const file = device.WebcamRef.current?.getScreenshot();
    const res = await fetch(`/api/predict?cam_id=${device.MediaData.deviceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: file }),
    });
    const data = await res.json();
    if (res.status == 415)
      ErrorPopup(data);
    else
      setModelData(modelData.concat(data));
  };
  /*
  - Fix model connectivity

  - Need to create a way to detect scanners
  - When scanning, the item must be displayed (can connect to web)

  - Fix multi-threading

  - Add image storage options (PostgreSQL or WindowsFileSystem)

  - Add rename section (Shadcn Dialog)
  - Add camera settings
  */

  React.useEffect(() => {
    // navigator.mediaDevices.enumerateDevices().then((e) => {console.log(e)})
    // fetchData();
  }, []);

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleAvailableDevices);
  }, [handleAvailableDevices]);

  return (
    <div className="w-screen h-screen flex text-white">
      <div className="w-4/5 bg-gray-900 transition-all duration-500 flex flex-col">
        <div className="flex items-center justify-center font-black text-2xl bg-blue-950">
          IMC Underbody Sealant Detection through AI
        </div>
        <div className={getGridSize() + ` grid h-full`}>
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
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="absolute text-black font-bold m-1">
                      {device.MediaData.label}
                    </div>
                    <Webcam
                      className="h-full"
                      audio={false}
                      videoConstraints={{
                        deviceId: device.MediaData.deviceId,
                        aspectRatio: screen.width / screen.height,
                      }}
                      onClick={async () => fetchData(device)}
                      screenshotFormat="image/jpeg"
                      ref={device.WebcamRef}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>Rename Camera</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-1/5 h-full flex flex-col items-center justify-between bg-gray-800 p-10 text-xl gap-y-2">
        <CamSelector
          className="flex justify-center items-center border h-8 w-full rounded-xl hover:bg-white hover:text-black transition-all hover:scale-110"
          devices={devices}
          handleDevices={handleDevices}
        />
        <div
          className="flex justify-center items-center border h-8 w-full rounded-xl hover:bg-white hover:cursor-pointer hover:text-black transition-all hover:scale-110"
          onClick={() => {
              // fetchData("teststring")
              /* Make a promise all here */
          }}
        >
          Retry
        </div>
        <div className="w-full h-1/2">
          <div className="flex flex-col items-center border h-full w-full rounded-xl my-2">
            Vehicle ID
            <Separator className="bg-gray-600" />
            -- -- --
          </div>
        </div>
        <div className="w-full h-1/2">
          <div className="flex flex-col items-center border h-full w-full rounded-xl my-2">
            Model Logs
            <Separator className="bg-gray-600" />
            <ScrollArea className="h-auto text-base w-full p-2">
              {modelData?.length === 0 ? (
                <div className="flex italic text-gray-400 justify-center">
                  No logs yet.
                </div>
              ) : (
                modelData?.map(({ cam_id, condition }, i) => (
                  <div key={i} className=" flex flex-col">
                    {`[${new Date().toLocaleTimeString()}] ` + cam_id}
                    <p
                      className={
                        (condition === "NG"
                          ? `text-red-500`
                          : `text-green-500`) + ` flex items-center font-black`
                      }
                    >
                      {condition}
                    </p>
                    <Separator />
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
        {/* <button
            className="flex justify-center items-center border h-8 w-full rounded-xl hover:bg-white hover:text-black transition-all hover:scale-110"
            // onClick={() => setUseDevices(useDevices.concat([devices[0]]))}
            // onClick={() => {fetch('/api/predict')}}
          >
            Test
          </button> */}
      </div>
    </div>
  );
}
