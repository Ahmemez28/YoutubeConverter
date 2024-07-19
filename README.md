# YouTube Converter

This project is a YouTube converter that allows users to convert YouTube videos to MP3 or MP4 format. The application consists of a React frontend and a Flask backend, and it can be deployed using Docker.

## Features

- Convert YouTube videos to MP3 format
- Convert YouTube videos to MP4 format
- Simple and modern user interface
- Spinner to indicate progress during the conversion process
- Dockerized setup for easy deployment

## Prerequisites

- Docker
- Docker Compose

## Installation and Usage

### Step 1:  Build and Run the Application

```docker
docker compose up --build -d
```

### Step 2: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
``` 
### Step 3: Convert YouTube Videos
- Enter the YouTube URL you want to convert.
- Click on "Convert to MP3" or "Convert to MP4".
- Wait for the conversion to complete and click on the provided download link to download your file.


### Project Structure

├── backend <br>
│   ├── downloads <br>
│   ├── backend.py <br>
│   ├── requirements.txt <br>
│   └── Dockerfile <br>
├── frontend <br>
│   ├── public<br>
│   ├── src<br>
│   ├── Dockerfile<br>
│   ├── package.json<br>
│   ├── package-lock.json<br>
│   └── README.md<br>
├── docker-compose.yml<br>
└── README.md<br>


### Backend

- The backend is a Flask application that handles the conversion of YouTube videos to MP3 or MP4 format.
- backend.py: The main Flask application.
- requirements.txt: List of Python dependencies.
- Dockerfile: Dockerfile for the backend service.

### Frontend

- The frontend is a React application that provides a user interface for the converter.
- public: Public assets for the React application.
- src: Source code for the React application.
- Dockerfile: Dockerfile for the frontend service.
- package.json: NPM package configuration.
- package-lock.json: Lockfile for NPM packages.
- Docker Compose
  The docker-compose.yml file defines two services: frontend and backend. The frontend service runs the React application, and the backend service runs the Flask application.

### Additional Notes

Ensure that you have Docker and Docker Compose installed on your machine before running the above commands.
The application runs on http://localhost:3000 for the frontend and http://localhost:5000 for the backend.
