export async function GET() {
  const res = await fetch("http://backend:8000");
  return res;
}
export async function POST(req: Request) {
  const file = await req.json()
  const resp = await fetch("http://backend:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(file),
    });
  return resp;
}