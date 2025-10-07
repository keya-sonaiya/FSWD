# EduMosaic API Documentation

## Overview

EduMosaic uses Supabase as its backend, providing a REST API, real-time subscriptions, authentication, and file storage. All API endpoints follow REST conventions and return JSON responses.

## Base URL

```
https://your-project.supabase.co
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limits

- Authentication endpoints: 60 requests per hour per IP
- API endpoints: 1000 requests per hour per user
- File uploads: 100 requests per hour per user

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/v1/signup`

**Headers:**
- `apikey: your-anon-key`
- `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Sign In

Authenticate an existing user.

**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Headers:**
- `apikey: your-anon-key`
- `Content-Type: application/json`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token"
}
```

### Get Current User

Get information about the currently authenticated user.

**Endpoint:** `GET /auth/v1/user`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `200 OK`
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Sign Out

Sign out the current user.

**Endpoint:** `POST /auth/v1/logout`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `204 No Content`

---

## Profile Management

### Get User Profile

Get the profile of the current user.

**Endpoint:** `GET /rest/v1/profiles?id=eq.{user_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `200 OK`
```json
[
  {
    "id": "user-uuid",
    "name": "John Doe",
    "role": "student",
    "bio": "Passionate learner",
    "avatar_url": "https://example.com/avatar.jpg",
    "is_approved": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Profile

Update the current user's profile.

**Endpoint:** `PATCH /rest/v1/profiles?id=eq.{user_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "John Doe Jr.",
  "bio": "Updated bio"
}
```

**Response:** `200 OK`
```json
[
  {
    "id": "user-uuid",
    "name": "John Doe Jr.",
    "bio": "Updated bio",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

---

## Course Management

### List Courses

Get a list of published courses with filtering and pagination.

**Endpoint:** `GET /rest/v1/courses`

**Headers:**
- `apikey: your-anon-key`

**Query Parameters:**
- `select` - Fields to select (default: `*`)
- `is_published` - Filter by publication status
- `category_id` - Filter by category
- `level` - Filter by difficulty level
- `order` - Sort order
- `limit` - Number of results to return
- `offset` - Number of results to skip

**Example:**
```
GET /rest/v1/courses?select=*,instructor:profiles!courses_instructor_id_fkey(name),category:categories(name)&is_published=eq.true&limit=12
```

**Response:** `200 OK`
```json
[
  {
    "id": "course-uuid",
    "title": "React Fundamentals",
    "slug": "react-fundamentals",
    "description": "Learn React from scratch",
    "short_description": "Introduction to React",
    "level": "beginner",
    "price": 99.00,
    "image_url": "https://example.com/course.jpg",
    "instructor_id": "instructor-uuid",
    "is_published": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "instructor": {
      "name": "Jane Smith"
    },
    "category": {
      "name": "Web Development"
    }
  }
]
```

### Get Course Details

Get detailed information about a specific course.

**Endpoint:** `GET /rest/v1/courses?slug=eq.{slug}`

**Headers:**
- `apikey: your-anon-key`

**Response:** `200 OK`
```json
[
  {
    "id": "course-uuid",
    "title": "React Fundamentals",
    "slug": "react-fundamentals",
    "description": "Comprehensive React course...",
    "level": "beginner",
    "price": 99.00,
    "instructor": {
      "id": "instructor-uuid",
      "name": "Jane Smith",
      "bio": "Senior React Developer"
    },
    "sections": [
      {
        "id": "section-uuid",
        "title": "Introduction",
        "content": "Welcome to the course...",
        "order_index": 0
      }
    ],
    "enrollments": [
      {
        "id": "enrollment-uuid",
        "student_id": "student-uuid"
      }
    ]
  }
]
```

### Create Course

Create a new course (instructors only).

**Endpoint:** `POST /rest/v1/courses`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Advanced React Patterns",
  "description": "Learn advanced React patterns and best practices",
  "short_description": "Master React patterns",
  "category_id": "category-uuid",
  "level": "advanced",
  "price": 199.00,
  "tags": ["react", "javascript", "patterns"]
}
```

**Response:** `201 Created`
```json
[
  {
    "id": "course-uuid",
    "title": "Advanced React Patterns",
    "slug": "advanced-react-patterns",
    "instructor_id": "instructor-uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Course

Update an existing course (course instructor only).

**Endpoint:** `PATCH /rest/v1/courses?id=eq.{course_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Updated Course Title",
  "price": 149.00,
  "is_published": true
}
```

**Response:** `200 OK`

### Delete Course

Delete a course (course instructor only).

**Endpoint:** `DELETE /rest/v1/courses?id=eq.{course_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `204 No Content`

---

## Course Sections

### Create Course Section

Add a section to a course.

**Endpoint:** `POST /rest/v1/course_sections`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "course_id": "course-uuid",
  "title": "Getting Started",
  "content": "In this section, we'll cover...",
  "order_index": 0
}
```

### Update Course Section

Update a course section.

**Endpoint:** `PATCH /rest/v1/course_sections?id=eq.{section_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Updated Section Title",
  "content": "Updated content..."
}
```

### Delete Course Section

Delete a course section.

**Endpoint:** `DELETE /rest/v1/course_sections?id=eq.{section_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `204 No Content`

---

## Enrollments

### Enroll in Course

Enroll the current user in a course.

**Endpoint:** `POST /rest/v1/enrollments`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "course_id": "course-uuid"
}
```

**Response:** `201 Created`
```json
[
  {
    "id": "enrollment-uuid",
    "student_id": "student-uuid",
    "course_id": "course-uuid",
    "status": "active",
    "progress": 0,
    "enrolled_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Student Enrollments

Get all enrollments for the current student.

**Endpoint:** `GET /rest/v1/enrollments?select=*,course:courses(title,slug,image_url)`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`

**Response:** `200 OK`
```json
[
  {
    "id": "enrollment-uuid",
    "student_id": "student-uuid",
    "course_id": "course-uuid",
    "status": "active",
    "progress": 45,
    "enrolled_at": "2024-01-01T00:00:00.000Z",
    "course": {
      "title": "React Fundamentals",
      "slug": "react-fundamentals",
      "image_url": "https://example.com/course.jpg"
    }
  }
]
```

### Update Enrollment Progress

Update progress for an enrollment.

**Endpoint:** `PATCH /rest/v1/enrollments?id=eq.{enrollment_id}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: application/json`

**Body:**
```json
{
  "progress": 75
}
```

**Response:** `200 OK`

---

## Categories

### Get All Categories

Get a list of all course categories.

**Endpoint:** `GET /rest/v1/categories?order=name`

**Headers:**
- `apikey: your-anon-key`

**Response:** `200 OK`
```json
[
  {
    "id": "category-uuid",
    "name": "Web Development",
    "slug": "web-development",
    "description": "Learn modern web technologies",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## File Upload

### Upload Course Image

Upload an image for a course.

**Endpoint:** `POST /storage/v1/object/course-images/{filename}`

**Headers:**
- `apikey: your-anon-key`
- `Authorization: Bearer jwt-token`
- `Content-Type: multipart/form-data`

**Body:**
- Form data with `file` field containing the image

**Response:** `200 OK`
```json
{
  "Key": "course-images/filename.jpg"
}
```

### Get Public URL

Get the public URL for an uploaded file:

```
https://your-project.supabase.co/storage/v1/object/public/course-images/{filename}
```

---

## Real-time Subscriptions

EduMosaic supports real-time subscriptions for live updates.

### Subscribe to Course Updates

```javascript
const subscription = supabase
  .channel('courses')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'courses'
  }, (payload) => {
    console.log('Course updated:', payload);
  })
  .subscribe();
```

### Subscribe to Enrollments

```javascript
const subscription = supabase
  .channel('enrollments')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'enrollments'
  }, (payload) => {
    console.log('New enrollment:', payload);
  })
  .subscribe();
```

---

## Webhooks

Set up webhooks in your Supabase project to receive notifications about:
- New user registrations
- Course enrollments
- Course publications
- Payment completions (if using Stripe)

---

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

### Python
```bash
pip install supabase
```

### Flutter
```yaml
dependencies:
  supabase_flutter: ^1.0.0
```

---

## Testing

Use the provided Postman collection for API testing:

1. Import `postman_collection.json`
2. Set environment variables:
   - `base_url`: Your Supabase project URL
   - `api_key`: Your Supabase anon key
3. Sign in to get an access token
4. Test all endpoints

---

## Support

For API support:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [GitHub repository](https://github.com/your-org/edumosaic)
- Contact the development team

---

*Last updated: January 2024*