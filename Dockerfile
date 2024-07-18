# Backend
FROM python:3.8-slim as backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["python", "app.py"]

# Frontend
FROM node:14 as frontend
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ .
RUN yarn build

# Final Stage
FROM python:3.8-slim
WORKDIR /app
COPY --from=backend /app /app/backend
COPY --from=frontend /app/build /app/frontend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
CMD ["python", "/app/backend/app.py"]
