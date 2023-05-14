# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm config set legacy-peer-deps true
RUN npm install
RUN npm i -g react-scripts@5.0.1

# Copy the rest of the app's source code to the working directory
COPY . .

EXPOSE 3000


# Set the command to run when the container starts
CMD ["npm", "start"]