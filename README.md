# Smart Leads Dashboard

A full-stack MERN lead management dashboard built with React, TypeScript, TailwindCSS, Node.js, Express, MongoDB, and Mongoose.

## Features

- JWT registration and login with bcrypt password hashing
- Protected routes and role-based access control for `admin` and `sales`
- Lead CRUD with typed validation and centralized error handling
- Combined status/source/search filters and latest/oldest sorting
- Backend pagination with 10 leads per page and response metadata
- Debounced search, loading states, empty states, form validation, and CSV export
- Responsive dashboard UI with dark mode support
- Docker setup for client, API, and MongoDB

## Roles

- `admin`: can create, update, delete, and export leads
- `sales`: can view, filter, search, create, and update leads; delete is restricted

## Local Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally or use Docker.
4. Start the app:

```bash
npm run dev
```

Client: `http://localhost:5173`

API: `http://localhost:5000/api`

## Docker Setup

```bash
cp .env.example .env
docker compose up --build
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
