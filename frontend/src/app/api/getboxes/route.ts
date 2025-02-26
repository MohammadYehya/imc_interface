import { NextRequest } from "next/server";

// const PATH = 'localhost'

export async function POST(req: NextRequest) {
  const file = await req.json()
  const resp = await fetch(`http://${process.env.SERVICE2_PATH || 'localhost'}:8001/predict/${req.nextUrl.searchParams.get('cam_id')}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(file),
    });
  return resp;
}