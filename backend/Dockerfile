# Use the official Python image from the Docker Hub
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code into the container
COPY . .

# Ensure the downloads directory exists and has the correct permissions
RUN mkdir -p /app/downloads && chmod -R 777 /app/downloads

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "backend.py"]
