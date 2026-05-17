# API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt>
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Mohan",
  "email": "mohan@example.com",
  "password": "Password123",
  "role": "admin"
}
```

Returns `201` with user and token.

### Login

`POST /auth/login`

```json
{
  "email": "mohan@example.com",
  "password": "Password123"
}
```

Returns `200` with user and token.

### Current User

`GET /auth/me`

Returns the authenticated user.

## Leads

### List Leads

`GET /leads?page=1&status=Qualified&source=Instagram&search=Rahul&sort=latest`

Query parameters:

- `page`: number, defaults to `1`
- `status`: `New`, `Contacted`, `Qualified`, `Lost`
- `source`: `Website`, `Instagram`, `Referral`
- `search`: name or email search
- `sort`: `latest` or `oldest`

Returns paginated data:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

### Get Lead

`GET /leads/:id`

### Update Lead

`PATCH /leads/:id`

```json
{
  "status": "Contacted"
}
```

### Delete Lead

`DELETE /leads/:id`

Admin only.
