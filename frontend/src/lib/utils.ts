import { toast } from "@/hooks/use-toast"
import { clsx, type ClassValue } from "clsx"
import Webcam from "react-webcam"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ErrorPopup(msg: string)
{
  return toast({
    variant: "destructive",
    title: "An Error Occured!",
    description: msg
  })
}

export interface WebcamInfo {
  MediaData: MediaDeviceInfo;
  WebcamRef: React.RefObject<Webcam | null>;
  CamLabel: string;
}