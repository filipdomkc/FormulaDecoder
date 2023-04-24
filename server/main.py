import cv2
import numpy as np
import uvicorn
from typing import Union, List
import utility
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse


app = FastAPI()
@app.get("/")
def home():
    return {"Hello": "world"}

@app.post("/uploadfile/")
async def upload_image_file(image: UploadFile = File(...)):
    # Load image using OpenCV
    img_bytes = await image.read()
    np_img  = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_img , cv2.IMREAD_COLOR)
    
    result = utility.process_n_calc(img)

    return JSONResponse(content={"result": str(result)})

if __name__=="__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)