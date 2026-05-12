# Task Management System

Full stack task management application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT, and bcrypt.

## Project Structure

```text
Task-Management-System/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
      app.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      api/
      assets/
      components/
      context/
      hooks/
      layouts/
      pages/
      routes/
      styles/
      utils/
      App.jsx
      main.jsx
    .env.example
    eslint.config.js
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
```

## Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies in each app:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend API on `http://localhost:5000`.
