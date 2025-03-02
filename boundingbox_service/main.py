from ultralytics import YOLO
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import base64
import io

model = YOLO("./best.pt")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

@app.get('/')
def home():
    return ''

@app.post('/predict/{cam_id}')
async def get(cam_id: str, file: Request):
    file = (await file.json())
    if file == {} or file == {'image':None}:
        return JSONResponse(content='Empty Image Sent!', status_code=415, media_type='application/json')
    file = file['image']
    if "data:image" in file:
        file = file.split(",")[1]
    img = base64.b64decode(file)
    img = Image.open(io.BytesIO(img))
    results = model(img, verbose=False)
    return [i.tolist() for i in results[0].boxes.xyxyn]

@app.websocket("/ws")
async def camerastream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            file = await websocket.receive_text()
            if file == {} or file == {'image':None}:
                return
            file = file['image']
            if "data:image" in file:
                file = file.split(",")[1]
            img = base64.b64decode(file)
            img = Image.open(io.BytesIO(img))
            results = model(img, verbose=False)
            await websocket.send_json([i.tolist() for i in results[0].boxes.xyxyn])
    except WebSocketDisconnect:
        print("Client disconnected")