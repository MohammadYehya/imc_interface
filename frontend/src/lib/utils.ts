import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function test(){
  return fetch('http://backend:8000')
  // const res = [{camid:"CAMERA1", condition:"NG"}, {camid:"CAMERA2", condition:"NG"}, {camid:"CAMERA3", condition:"OK"}, {camid:"CAMERA4", condition:"NG"}]
  // return Response.json(res);
}