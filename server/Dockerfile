FROM ubuntu:20.04 as base

# Install Tesseract dependencies and add repository
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:alex-p/tesseract-ocr5 && apt-get update
RUN apt-get install -y tesseract-ocr=5.3.1-1ppa1~focal1

# Install Python and other necessary dependencies
RUN apt-get install -y python3 python3-pip

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the app dependencies from requirements file
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Define the entry point or default command to run your application
CMD ["python3", "main.py"]
