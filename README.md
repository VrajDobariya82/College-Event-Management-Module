# College Events API

A RESTful API for a college event management system using Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, get profile)
- CRUD operations for college events
- Image uploads for events
- Protected routes with JWT authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository or download the code

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_events_123456
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

4. Run the server:
```
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get currently logged in user (Protected)

### Event Routes (All Protected)

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

## Request & Response Examples

### Register User

Request:
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Event

Request:
```
POST /api/events
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Annual Cultural Fest",
  "description": "The biggest cultural event of the year",
  "date": "2023-12-10",
  "location": "College Auditorium",
  "type": "Cultural",
  "image": [file upload]
}
```

Response:
```
{
  "success": true,
  "data": {
    "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Annual Cultural Fest",
    "description": "The biggest cultural event of the year",
    "date": "2023-12-10T00:00:00.000Z",
    "location": "College Auditorium",
    "type": "Cultural",
    "imageUrl": "/uploads/image-1621234567890.jpg",
    "user": "60a1b2c3d4e5f6a7b8c9d0e1",
    "createdAt": "2023-05-15T12:34:56.789Z"
  }
}
```

## Project Structure

```
college-events-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── eventController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── Event.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── eventRoutes.js
├── uploads/
├── .env
├── package.json
├── README.md
└── server.js
```

## Error Handling

- 400: Bad Request (Invalid data)
- 401: Unauthorized (Authentication required)
- 403: Forbidden (Not authorized to perform action)
- 404: Not Found (Resource not found)
- 500: Server Error 