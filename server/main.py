import cv2
import numpy as np
import uvicorn
from utilityoop import ImageProcessor, EquationParser, Solver
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://frontend:80",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"Hello": "world"}

@app.post("/uploadfile")
async def upload_image_file(image: UploadFile = File(...)):
    contents = await image.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_processor = ImageProcessor(img)
    processed_img = img_processor.processed_img
    
    ep = EquationParser(processed_img)
    equation = ep.parse_equation()
    
    solver = Solver(equation)
    solver.solve()
    
    solution = solver.solutions

    return JSONResponse(content={"result": solution})

if __name__=="__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)