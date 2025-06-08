# API Documentation - Enhanced Features

## Overview
This document outlines the enhanced API features including profile management, activity logging, password changes, and support ticket system.

## Authentication
All protected routes require JWT authentication via HTTP-only cookies.

## Enhanced APIs

### 1. Profile Management API

#### GET `/api/auth/profile`
- **Description**: Get current user profile
- **Authentication**: Required
- **Response**: User profile data (excluding password)

#### PUT `/api/auth/profile`
- **Description**: Update user profile with activity logging
- **Authentication**: Required
- **Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "bio": "string"
}
```
- **Features**:
  - Email uniqueness validation
  - Change tracking and logging
  - Activity log creation for profile updates

### 2. Password Management API

#### PUT `/api/auth/change-password`
- **Description**: Change user password with activity logging
- **Authentication**: Required
- **Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
- **Features**:
  - Current password verification
  - Password strength validation (minimum 6 characters)
  - Secure bcrypt hashing
  - Activity logging for password changes

### 3. Activity Logging API

#### GET `/api/admin/activity`
- **Description**: Get activity logs with filtering and pagination
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (all, success, failed, warning)
  - `action`: Filter by action type
  - `search`: Search in action, resource, or details

#### POST `/api/admin/activity`
- **Description**: Create new activity log entry
- **Authentication**: Required
- **Body**:
```json
{
  "action": "string",
  "resource": "string",
  "details": "string",
  "status": "success|failed|warning"
}
```

### 4. Help/Support Ticket API

#### POST `/api/admin/help`
- **Description**: Submit support ticket with email notification
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "problemType": "string",
  "subject": "string",
  "message": "string",
  "priority": "low|medium|high"
}
```
- **Features**:
  - Email notification to `pawandevmern@gmail.com`
  - Ticket storage in database
  - Activity logging

#### GET `/api/admin/help`
- **Description**: Get user's support tickets
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by ticket status

## Enhanced Job Management APIs

### Job Creation with Activity Logging
- **Route**: `POST /api/jobs`
- **Enhancement**: Logs job creation activities

### Job Updates with Activity Logging
- **Route**: `PUT /api/jobs/[id]`
- **Enhancement**: Logs job update activities with change tracking

### Job Deletion with Activity Logging
- **Route**: `DELETE /api/jobs/[id]`
- **Enhancement**: Logs job deletion activities

## Enhanced Authentication APIs

### Login with Activity Logging
- **Route**: `POST /api/auth/login`
- **Enhancement**: 
  - Logs successful login attempts
  - Logs failed login attempts (both invalid user and invalid password)
  - Tracks IP address and user agent

### Logout with Activity Logging
- **Route**: `POST /api/auth/logout`
- **Enhancement**: 
  - Logs logout activities
  - Tracks user information before token clearance

## Activity Log Schema

Activity logs are stored with the following structure:

```json
{
  "userId": "ObjectId",
  "action": "string",
  "resource": "string",
  "details": "string",
  "ipAddress": "string",
  "userAgent": "string",
  "timestamp": "Date",
  "status": "success|failed|warning"
}
```

## Activity Types Tracked

1. **Authentication**:
   - Login (successful/failed)
   - Logout
   - Password changes

2. **Profile Management**:
   - Profile updates (with field-level tracking)

3. **Job Management**:
   - Job creation
   - Job updates
   - Job deletion

4. **Support System**:
   - Help ticket submissions

## Email Configuration

For the support ticket system to work, configure these environment variables:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Note**: Use Gmail App Password for `EMAIL_PASSWORD`, not your regular Gmail password.

## Security Features

1. **JWT Authentication**: All protected routes verify JWT tokens
2. **Role-based Access**: Admin-only routes check user roles
3. **Password Security**: bcrypt hashing with salt rounds
4. **Activity Tracking**: Comprehensive logging for audit trails
5. **Input Validation**: Server-side validation for all inputs
6. **Error Handling**: Secure error messages without sensitive data exposure

## Error Responses

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Success Responses

All APIs return consistent success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```