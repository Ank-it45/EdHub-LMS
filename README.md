# EdHub — Full-Stack Learning Management Platform

EdHub is a full-stack learning management platform that allows students to discover and enroll in courses, instructors to create and manage courses, and administrators to oversee the platform.

The application is built around a React frontend, an Express/Node.js REST API, PostgreSQL, and Prisma ORM. It includes JWT authentication, server-side role-based access control, course management, Cloudinary media integration, and a simulated payment-to-enrollment workflow.

> **Payment Notice:** EdHub uses a simulated/demo payment flow for project purposes. It does **not** process real payments or charge real money.

---

## Features

### Student
- Register and log in securely.
- Browse and search the course catalog.
- View course details, curriculum, instructor information, and pricing.
- Enroll through the simulated demo-payment workflow.
- View enrolled courses in **My Learning**.
- View order/payment information.
- Register for the Instructor role using the same account when eligible.

### Instructor
- Instructor-specific dashboard and Instructor Studio.
- Create new courses.
- Edit existing courses.
- Edit **What You'll Master / learning outcomes**.
- Manage course information, pricing, category, level, and media.
- View course and enrollment information.
- Cannot purchase their own courses.

### Administrator
- Administrator dashboard.
- Platform-level visibility into users, courses, orders, and simulated transaction volume.
- Server-side authorization for protected administrative functionality.

### Authentication & Authorization
- JWT-based authentication.
- Password hashing with `bcryptjs`.
- Server-side role-based access control (RBAC).
- Protected API routes.
- Ownership checks for user-specific resources.
- Instructor self-purchase protection.
- Duplicate enrollment prevention.

### Course & Enrollment Workflow

```text
Student
   │
   ▼
Browse Course
   │
   ▼
Create Order
   │
   ▼
PENDING
   │
   ▼
Simulated Demo Payment
   │
   ├── FAILED / CANCELLED
   │
   └── SUCCESS
          │
          ▼
       PLACED
          │
          ▼
   Enrollment ACTIVE
```

The backend verifies the course price from PostgreSQL when creating an order instead of trusting a price supplied by the frontend.

### Media
- Cloudinary integration for course media.
- Media upload functionality is handled through the backend media API.

### UI
- React 18.
- Bootstrap 5 responsive layout.
- Custom glassmorphism styling.
- Role-specific navigation and dashboards.
- Lucide/Bootstrap icons and SVG-based interface elements.

---

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Bootstrap 5
- Bootstrap Icons
- Lucide React
- Vite

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- Express Validator
- Multer
- Cloudinary
- Morgan
- CORS

### Database
- PostgreSQL
- Prisma ORM

### Testing
- Node.js HTTP-based API integration test suite
- 12 automated backend integration tests

---

## Architecture

```text
┌───────────────────────────────┐
│        React + Vite           │
│        Bootstrap 5            │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│                               │
│ JWT Authentication            │
│ Server-side RBAC              │
│ Validation & Business Logic   │
│ Course / Order / Enrollment   │
│ Media API                     │
└───────────────┬───────────────┘
                │
                │ Prisma ORM
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
│                               │
│ Users                         │
│ Courses                       │
│ Orders                        │
│ Payments                      │
│ Enrollments                   │
└───────────────────────────────┘

                │
                ▼
          Cloudinary
        Course Media
```

---

## Project Structure

```text
EdHub/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── tests/
│   │   └── api_test.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> `.env` is local configuration and must not be committed to GitHub. Create it locally using the environment variables required by the backend.

---

## Prerequisites

Install the following before running EdHub:

- Node.js 18+ recommended
- npm
- PostgreSQL
- A PostgreSQL database named `edhub_db`
- Cloudinary account if testing media upload functionality

---

## Local Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd EdHub
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE edhub_db;
```

Make sure PostgreSQL is running locally.

### 3. Configure backend environment variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/edhub_db?schema=public"

JWT_SECRET="your_jwt_secret"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Use your own credentials. Never commit the real `.env` file.

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Create/update the PostgreSQL schema

```bash
npx prisma db push
```

### 7. Seed demo data

```bash
npm run seed
```

### 8. Start the backend

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 9. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Demo Accounts

All seeded demo accounts use:

```text
Password: Password123!
```

| Role | Name | Email |
|---|---|---|
| Student | Ankit Chaudhary | `ankit.student@edhub.dev` |
| Student | Elena Rostova | `elena.code@edhub.dev` |
| Instructor | Priya Sharma | `priya.dev@edhub.dev` |
| Instructor | Rahul Verma | `rahul.cloud@edhub.dev` |
| Admin | System Admin | `admin@edhub.dev` |

### Useful role-testing scenarios

**Student**
- Browse courses.
- Create an order.
- Complete a demo payment.
- Verify enrollment.
- Test Instructor registration using the same account.

**Instructor**
- Create a course.
- Edit course details.
- Edit learning outcomes.
- Verify that the instructor cannot purchase their own course.

**Admin**
- Open the administrator dashboard.
- Review platform-level metrics and management functionality.

---

## Screenshots

### Landing Page

![EdHub Landing Page](screenshots/landing-page.png)

### Login & Registration

![EdHub Login Page](screenshots/login-page.png)

### Student Experience

![EdHub Student Page 1](screenshots/student-page1.png)

![EdHub Student Page 2](screenshots/student-page2.png)

### Course Purchase & Payment

![EdHub Course Purchase Page](screenshots/course-purchase-page.png)

![EdHub Simulated Payment](screenshots/payment.png)

### Instructor Studio

![EdHub Instructor Page 1](screenshots/instructor-page1.png)

![EdHub Instructor Page 2](screenshots/instructor-page2.png)

![EdHub Instructor Page 3](screenshots/instructor-page3.png)

### Admin Dashboard

![EdHub Admin Dashboard](screenshots/admin.png)

## API Overview

The backend exposes REST API groups including:

```text
/api/auth
/api/users
/api/courses
/api/orders
/api/enrollments
/api/media
/api/health
```

Example health check:

```http
GET /api/health
```

Authentication uses:

```http
Authorization: Bearer <JWT_TOKEN>
```

Protected resources validate authentication, role permissions, and ownership on the server.

---

## Testing

EdHub includes an automated backend integration test suite.

From the backend directory:

```bash
cd backend
node tests/api_test.js
```

The suite currently validates **12 backend scenarios**:

1. Health check
2. Student login
3. Instructor login
4. Course listing
5. Student RBAC protection
6. Instructor course creation
7. Instructor learning-outcome editing
8. Instructor self-purchase protection
9. Order creation with server-side price verification
10. Simulated payment confirmation
11. Duplicate enrollment prevention
12. Student enrollment listing

A successful run ends with:

```text
🎉 ALL 12 BACKEND INTEGRATION TESTS PASSED!
```

---

## Database Model

The PostgreSQL database is managed through Prisma.

Core entities:

```text
User
 │
 ├── Courses
 ├── Orders
 └── Enrollments

Course
 │
 ├── Enrollments
 └── Orders

Order
 │
 └── Payment
```

The project uses PostgreSQL only.

Prisma schema:

```text
backend/prisma/schema.prisma
```

---

## Security

The project includes several server-side protections:

- JWT authentication.
- Password hashing with bcrypt.
- Role-based authorization.
- Protected API routes.
- User ownership validation.
- Course ownership validation.
- Server-side course-price verification.
- Instructor self-purchase prevention.
- Duplicate enrollment prevention.
- Request validation.

Frontend visibility is not treated as a security boundary; authorization is enforced by the backend.

---

## Environment & Secrets

Never commit:

```text
.env
.env.*
```

The repository `.gitignore` is configured to exclude environment files, dependency folders, build output, logs, local database artifacts, and other development-only files.

If you deploy the application, configure environment variables through the hosting provider instead of committing secrets to GitHub.

---

## Current Payment Model

EdHub intentionally uses a simulated payment system.

A successful demo payment:

```text
Payment: PENDING → SUCCESS
Order:   PENDING → PLACED
Enrollment: → ACTIVE
```

The system generates a mock transaction ID and does not communicate with a real payment gateway.

This architecture can later be extended with a real payment provider while keeping the order/enrollment business workflow separated from the payment implementation.

---

## Future Improvements

Potential future enhancements include:

- Production deployment.
- Real payment gateway integration.
- More advanced course content/lesson management.
- Course progress tracking.
- Certificates.
- Reviews and ratings.
- Pagination and advanced search.
- Automated CI/CD pipeline.
- More comprehensive frontend tests.
- Production monitoring and logging.

---

## Project Status

**Status: Completed and tested locally.**

The current version has been tested through the backend integration suite and supports the complete core workflow from authentication and course management through simulated payment and enrollment.

---

## Author

**Ankit Chaudhary**

Full-Stack Web Development Project

Built with React, Node.js, Express, PostgreSQL, Prisma, JWT, Cloudinary, and Bootstrap.
