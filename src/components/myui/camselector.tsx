import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CamSelector({ devices, handleDevices, className=`` } : { devices:MediaDeviceInfo[], handleDevices: (device: MediaDeviceInfo) => void, className:string}) {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger className={className}>
        Select Available Cameras
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>Select Available Cameras</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          {
            devices.length === 1 && devices[0].deviceId === '' ?
            <DropdownMenuItem>No Detected Devices</DropdownMenuItem>
            :
            devices.map((device, key) => <DropdownMenuItem key = {key} onClick={() => handleDevices(device)}>{ device.label }</DropdownMenuItem>)
          }
        </DropdownMenuContent>
      </DropdownMenu>
    )
}