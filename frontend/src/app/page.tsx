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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Webcam from "react-webcam";
import React from "react";
import { ErrorPopup, WebcamInfo } from "@/lib/utils";

export const dynamic = "force-dynamic";


export default function Home() {
  const [selectedDevice, setSelectedDevice] = React.useState<WebcamInfo>();
  const [useDevices, setUseDevices] = React.useState<WebcamInfo[]>([]);
  const [devices, setDevices] = React.useState<WebcamInfo[]>([]);
  const [renameTo, setRenameTo] = React.useState("")
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = React.useState(false);
  const [modelData, setModelData] = React.useState([]);

  const handleDevices = (device: MediaDeviceInfo) => {
    if (useDevices.map((dev) => dev.MediaData.deviceId).includes(device.deviceId))
      setUseDevices(
        useDevices.filter((dev) => device.deviceId != dev.MediaData.deviceId)
      );
    else
      setUseDevices(
        useDevices.concat([
          {
            MediaData: device,
            WebcamRef: React.createRef(),
            CamLabel: device.label,
          },
        ])
      );
  };

  const handleAvailableDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput").map((dev) => {return {MediaData: dev, WebcamRef: React.createRef(), CamLabel: dev.label}})),
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
    const res = await fetch(
      `/api/predict?cam_id=${device.MediaData.deviceId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: file }),
      }
    );
    const data = await res.json();
    if (res.status == 415) ErrorPopup(data);
    else setModelData(modelData.concat(data));
  };
  /*
  - Fix time of outputs

  - Need to create a way to detect scanners
  - When scanning, the item details must be displayed (can connect to web)
  
  - Add fetches for each camera
  - Fix multi-threading

  - Add image storage options (PostgreSQL or WindowsFileSystem)
  */

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleAvailableDevices);
  }, [handleAvailableDevices]);

  return (
    <>
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Camera</DialogTitle>
            <DialogDescription>
              Rename the camera to a specific name.
            </DialogDescription>
            <form className="flex flex-col">
              <input
                className="rounded-xl border border-black p-1"
                type="text"
                name="camname"
                onChange={(e) => setRenameTo(e.target.value)}
              />
              <button
              className="rounded-xl border border-black p-1 m-1"
                onClick={(e) => {
                  e.preventDefault();
                  setUseDevices(
                    useDevices.map((dev) => {
                      if (
                        dev.MediaData.deviceId ===
                        selectedDevice?.MediaData.deviceId
                      )
                        dev.CamLabel = renameTo;
                      return dev;
                    })
                  );
                  setDevices(
                    devices.map((dev) => {
                      if (
                        dev.MediaData.deviceId ===
                        selectedDevice?.MediaData.deviceId
                      )
                        dev.CamLabel = renameTo;
                      return dev;
                    })
                  );
                  setIsRenameOpen(!isRenameOpen);
                  
                }}
              >
                Rename
              </button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove</DialogTitle>
            <DialogDescription>
              Remove this camera from your view? You can re-add it from the
              menu.
            </DialogDescription>
            <div className="flex gap-x-4 justify-center">
              <div
                className="hover:cursor-pointer bg-red-500 border border-black rounded-xl p-1 flex items-center justify-center hover:scale-125 transition-all"
                onClick={() => {
                  handleDevices(selectedDevice!.MediaData);
                  setIsRemoveOpen(!isRemoveOpen);
                }}
              >
                Remove
              </div>
              <div
                className="hover:cursor-pointer bg-white border border-black rounded-xl p-1 flex items-center justify-center hover:scale-125 transition-all"
                onClick={() => setIsRemoveOpen(!isRemoveOpen)}
              >
                Cancel
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
                  <ContextMenu modal={false}>
                    <ContextMenuTrigger>
                      <div className="absolute text-black font-bold m-1">
                        {device.CamLabel}
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
                      <ContextMenuItem
                        onClick={() => {
                          setIsRenameOpen(!isRenameOpen);
                          setSelectedDevice(device);
                        }}
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setIsRemoveOpen(!isRemoveOpen);
                          setSelectedDevice(device);
                        }}
                      >
                        Settings
                      </ContextMenuItem>
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
                            : `text-green-500`) +
                          ` flex items-center font-black`
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
    </>
  );
}
