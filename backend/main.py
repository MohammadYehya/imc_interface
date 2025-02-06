import asyncio
import base64
import io
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
import torch
from PIL import Image
from transformers import ViTForImageClassification

app = FastAPI()

img_height, img_width = 224, 224
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
transform = transforms.Compose([
    transforms.Resize((img_height, img_width)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

model = ViTForImageClassification.from_pretrained("./model", num_labels=2)
try:
    model.load_state_dict(torch.load('vit_aug_sealant_detection_model.pth', map_location=device))
except:
    print('model failed to load')

model.to(device)
print('model loaded')

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
    img = Image.open(io.BytesIO(img))
    input_tensor = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(pixel_values=input_tensor).logits
        predicted_class = torch.argmax(outputs, dim=1).item()
    
    # Store Images
    # with open(f"images/{uuid.uuid4()}.jpg", "wb") as f:
    #     f.write(img)
    
    return {'cam_id': cam_id, 'condition': "NG" if predicted_class == 0 else "OK"}