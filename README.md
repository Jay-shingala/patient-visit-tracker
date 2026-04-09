# Patient Visit Tracker

A full-stack Next.js application for managing clinicians, patients, and visit history with Prisma ORM and a Neon-hosted PostgreSQL database.

## Stack

- Next.js App Router
- React + TypeScript
- Prisma ORM
- Neon PostgreSQL
- Tailwind CSS v4

## Features

- Create and list clinicians
- Create and list patients
- Record visits linked to both clinicians and patients
- List visits in reverse chronological order
- Filter visits by clinician and/or patient
- API routes built with Next.js route handlers

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy below env variable to `.env` and replace the placeholder Neon connection string:

```env
DATABASE_URL="postgresql://username:password@your-pooled-endpoint.neon.tech/patient_visit_tracker?sslmode=require&pgbouncer=true"
```

3. Generate the Prisma client and sync the schema:

```bash
npm run prisma:generate
npm run prisma:push
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

- `GET /api/clinicians`
- `POST /api/clinicians`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/visits?clinicianId=...&patientId=...`
- `POST /api/visits`


