import base64
import uuid
from fastapi import FastAPI, File, Request, UploadFile
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
    for i in range(99999999):
        continue
    return [{'message': 'home'}]

@app.post('/predict/')
async def get(file: Request):
    file = (await file.json())['image']
    if "data:image" in file:
        file = file.split(",")[1]
    img = base64.b64decode(file)
    with open(f"images/{uuid.uuid4()}.jpg", "wb") as f:
        f.write(img)
    return [{'message': 'home'}]