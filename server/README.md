# CampusCode Server

## Database Setup

### Initial Database Setup

1. Create a new PostgreSQL database for the application
2. Run the following SQL queries to set up the required tables:

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'faculty', 'admin'))
);

-- Add indexes for better performance
CREATE INDEX users_email_idx ON users(email);

-- Create batches table
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    graduation_year INTEGER NOT NULL,
    course_department VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for created_by foreign key
CREATE INDEX batches_created_by_idx ON batches(created_by);
```

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Starting the Server

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm run dev
```

## API Documentation

The API documentation will be added here as endpoints are developed.

## Assignments API

This project now includes an Assignments feature with a REST API. The assignments endpoints are mounted under `/api/assignments`.

Authentication: creating, updating and deleting assignments require a valid JWT in the `Authorization` header (format: `Bearer <token>`) and use the existing `verifyToken` middleware.

Endpoints

- POST /api/assignments
  - Description: Create a new assignment (protected)
  - Headers: `Authorization: Bearer <JWT>`; `Content-Type: application/json`
  - Body (example):

```json
{
  "title": "DSA — Arrays Practice",
  "description": "Solve array problems covering basic operations, sorting and searching.",
  "attachments": [
    { "url": "https://example.com/files/arrays.pdf", "name": "arrays.pdf" }
  ],
  "auto_evaluation": true,
  "due_date": "2025-10-15T23:59:00.000Z",
  "start_time": "09:00:00",
  "duration_mins": 120,
  "visibility": "selected_batches",
  "grading_type": "auto",
  "total_marks": 100,
  "release_option": "publish_immediately",
  "preview": "DSA — Arrays Practice\nDue: Oct 15, 2025",
  "assigned_batches": [1, 2]
}
```

- GET /api/assignments

  - Description: Get all assignments (public)

- GET /api/assignments/:id

  - Description: Get a single assignment by id

- PUT /api/assignments/:id
  - Description: Update an assignment (protected)
  - Headers: `Authorization: Bearer <JWT>`; `Content-Type: application/json`
  - Body: include only the fields to update. Example:

```json
{
  "title": "DSA — Arrays Practice (Updated)",
  "total_marks": 120,
  "assigned_batches": [2, 3]
}
```

- DELETE /api/assignments/:id
  - Description: Delete an assignment (protected)
  - Headers: `Authorization: Bearer <JWT>`

PostgreSQL CREATE TABLE statements (run these on your DB when using raw SQL migrations)

```sql
-- assignments table
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachments JSON,
    auto_evaluation BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    start_time TIME,
    duration_mins INTEGER,
    visibility VARCHAR(50) DEFAULT 'selected_batches',
    grading_type VARCHAR(50) DEFAULT 'manual',
    total_marks INTEGER,
    release_option VARCHAR(50) DEFAULT 'immediate',
    preview JSON,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- assignment_batches join table
CREATE TABLE assignment_batches (
    assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, batch_id)
);
```

Testing notes

- The `attachments` field stores JSON (array of file metadata). File upload handling is not implemented in these endpoints — attachments must be provided as URLs or metadata in the request body.
- The `assigned_batches` array should contain existing `batches.id` values.
- The controller will populate related `creator` (user) and `batches` in responses.

If you want, I can also add a migration file for Sequelize to create these tables automatically, or add example Postman collections. Tell me which you prefer.
