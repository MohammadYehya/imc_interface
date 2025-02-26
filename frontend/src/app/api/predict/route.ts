import { NextRequest } from "next/server";

// const PATH = 'aimodel_service'

export async function GET() {
  const res = await fetch(`http://${process.env.SERVICE1_PATH || 'localhost'}:8000`);
  return res;
}
export async function POST(req: NextRequest) {
  const file = await req.json()
  const resp = await fetch(`http://${process.env.SERVICE1_PATH || 'localhost'}:8000/predict/${req.nextUrl.searchParams.get('cam_id')}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(file),
    });
  return resp;
}