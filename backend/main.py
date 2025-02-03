import asyncio
import base64
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def get():
    await asyncio.sleep(5)
    print('here')
    return [{'message': 'home'}]

@app.post('/predict/{cam_id}')
async def get(cam_id: str, file: Request):
    file = (await file.json())
    if file == {} or file == {'image':None}:
        return JSONResponse(content='Empty Image Sent!', status_code=415, media_type='application/json')
    file = file['image']
    if "data:image" in file:
        file = file.split(",")[1]
    img = base64.b64decode(file)
    # Do processing

    # Store Images
    # with open(f"images/{uuid.uuid4()}.jpg", "wb") as f:
    #     f.write(img)
    
    return {'cam_id': cam_id, 'condition': file}