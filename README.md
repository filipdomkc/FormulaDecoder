# $\color[RGB]{0,223,154} FORMULADECODER.$ 

<span style="color: green;">FORMULA**DECODER.**</span> is an AI based application which took inspiration from Photomath app. The goal of this demo project was to build a model that would recognize digits and symbols formulated in a mathematical equation from the picture. Then, the application should be able to solve equation from the picture and give a user the final result.

This project aims to develop a Photomath-like application to enhance full-stack development skills.

## Project Steps

1. **Initial Analysis**: Conduct a thorough analysis of the Photomath app to gain a comprehensive understanding of its functionality and architecture.
2. **Infrastructure Design**: Create a rough schema for the infrastructure that will be developed, considering the backend server, frontend client, and mobile app components.
3. **OCR Testing and Algorithm Development**: Test the capabilities of Google Tesseract OCR and develop algorithms that process the Tesseract results. Utilize numpy and OpenCV for input data processing. The algorithms involve using OpenCV thresholding to identify contours on the image, generating bounding boxes around digits and symbols, cropping the bounding boxes from the image, sorting the equation, classifying digits, and solving the equation.
4. **Backend Development**: Implement a Python-based backend server using FastAPI framework. This server will handle requests from the frontend application and mobile apps (android and ios) and provide the necessary functionality for equation processing.
5. **Frontend Client**: Develop the frontend client application using ReactJS. The client will interact with the backend server, sending equation images for processing and displaying the results.
6. **Dockerization**: Dockerize both the frontend and backend applications using Docker Compose. Create Docker images and push them to DockerHub for easy deployment.
7. **Deployment**: Deploy the application to an Amazon AWS EC2 instance using Docker Composed containers. Set up Nginx as a reverse proxy server to handle incoming requests and distribute them to the appropriate containers.
8. **Mobile App Development**: Develop a mobile app using React Native with Expo. The mobile app will also utilize the API endpoints hosted on the AWS EC2 instance to respond to equation processing requests.

## Tools Used

- Python: Programming language used for backend server development and algorithm implementation.
- NumPy, OpenCV: Libraries used for input data processing, including image manipulation and contour detection.
- Jupyter Notebook, Visual Studio Code: Integrated development environments used for code development and testing.
- Python FastAPI: Framework used for building the HTTP server that handles requests from the frontend application.
- Nginx: Reverse proxy server used to distribute incoming requests to the appropriate containers.
- ReactJS: JavaScript library used for building the frontend user interface.
- React Native with Expo: Framework used for developing the mobile application.
- Amazon AWS EC2: Cloud computing service used for deploying the application using Docker containers.

Feel free to explore the project and contribute to its development. For more details and instructions on how to run the application, please refer to the project documentation.

## How this app works
**Example of using app via web UI**

![Animation](https://github.com/filipdomkc/FormulaDecoder/assets/68906633/d0ff9016-d4c4-40e1-8ecc-74e35e303e20)

**Example of using app via mobile app**
(..to be posted)
