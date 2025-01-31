import { NextRequest } from "next/server";

const PATH = 'backend'

export async function GET() {
  const res = await fetch(`http://${PATH}:8000`);
  return res;
}
export async function POST(req: NextRequest) {
  const file = await req.json()
  const resp = await fetch(`http://${PATH}:8000/predict/${req.nextUrl.searchParams.get('cam_id')}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(file),
    });
  return resp;
}