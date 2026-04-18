# PawMatch API

Pet Adoption Management REST API built with Node.js, Express, and MongoDB for IFN666 Assessment 2.

## Setup

### Prerequisites
- Node.js
- MongoDB

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the server root:

```
MONGODB_URI=mongodb://localhost:27017/pawmatch
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

The server runs at `http://localhost:4000`.

## API Endpoints

All routes are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and receive JWT token | No |

### Shelters

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /shelters | List all shelters (paginated, searchable, sortable) | No |
| GET | /shelters/:id | Get shelter details with its pets | No |
| POST | /shelters | Create a shelter | Yes |
| PUT | /shelters/:id | Update a shelter | Yes |
| DELETE | /shelters/:id | Delete a shelter (must have no pets) | Yes |

### Pets

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /pets | List all pets (paginated, searchable, sortable) | No |
| GET | /pets/:id | Get pet details with its applications | No |
| POST | /pets | Create a pet | Yes |
| PUT | /pets/:id | Update a pet | Yes |
| DELETE | /pets/:id | Delete a pet (must have no pending applications) | Yes |

### Adoption Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /applications | List all applications (paginated, searchable, sortable) | No |
| GET | /applications/:id | Get application details | No |
| POST | /applications | Create an application | Yes |
| PUT | /applications/:id | Update an application | Yes |
| DELETE | /applications/:id | Delete an application | Yes |

### Nested Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /shelters/:shelterId/pets | Get all pets at a shelter |
| GET | /pets/:petId/applications | Get all applications for a pet |
| GET | /users/:userId/applications | Get all applications by a user |

## Authentication

The API uses JWT (JSON Web Tokens). To access protected endpoints:

1. Register: `POST /api/auth/register` with `{ username, password }`
2. Login: `POST /api/auth/login` with `{ username, password }` to receive a token
3. Include the token in requests: `Authorization: Bearer <token>`

### Password Requirements
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Pagination links are returned in the `Link` HTTP header.

### Search
- `search` - Search term (searches by name for shelters/pets, by status for applications)

### Sort
- `sort` - Sort field (prefix with `-` for descending)
- Shelters: `name`, `-name`, `address`, `-address`
- Pets: `name`, `-name`, `species`, `-species`, `age`, `-age`
- Applications: `status`, `-status`, `message`, `-message`

## Business Logic

- Cannot create an application for a pet that is already adopted
- When an application is approved, the pet is automatically marked as adopted and all other pending applications for that pet are rejected
- Cannot delete a shelter that still has pets
- Cannot delete a pet that has pending applications

## Data Models

### User
- `username` (String, required, unique)
- `password` (String, required, hashed with bcrypt)
- `is_admin` (Boolean, default: false)

### Shelter
- `name` (String, required)
- `address` (String, required)
- `phone` (String, required)
- `email` (String, required, valid email)
- `description` (String, optional)

### Pet
- `name` (String, required)
- `species` (String, required: dog, cat, bird, rabbit, other)
- `breed` (String, required)
- `age` (Number, required)
- `gender` (String, required: male, female)
- `description` (String, required)
- `status` (String: available, pending, adopted)
- `shelter` (Reference to Shelter, required)

### Application
- `applicant` (Reference to User, required)
- `pet` (Reference to Pet, required)
- `status` (String: pending, approved, rejected)
- `message` (String, required)

## API Collection

Import `API-collection.json` into Postman or Hoppscotch to test all endpoints.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- express-validator for input validation
- mongoose-paginate-v2 for pagination
- morgan for request logging
- bcrypt for password hashing
