import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { WebcamInfo } from "@/lib/utils";
  
  export function CamSelector({ devices, handleDevices, className=`` } : { devices:WebcamInfo[], handleDevices: (device: MediaDeviceInfo) => void, className:string}) {
      return (
          <DropdownMenu>
          <DropdownMenuTrigger className={className}>
          Select Cameras
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>Select Available Cameras</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            {
              devices.length === 1 && devices[0].MediaData.deviceId === '' ?
              <DropdownMenuItem>No Detected Devices (either due to insufficient permissions or no connected devices)</DropdownMenuItem>
              :
              devices.map((device, key) => <DropdownMenuItem key = {key} onClick={() => handleDevices(device.MediaData)}>{ device.CamLabel }</DropdownMenuItem>)
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
  }