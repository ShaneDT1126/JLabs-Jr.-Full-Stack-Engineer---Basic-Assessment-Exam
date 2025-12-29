# JLabs Exam - Backend API

Express/Node.js REST API with MySQL database for authentication and IP geolocation search history.

## Prerequisites

- Node.js
- MySQL
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE jlabs_exam;
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jlabs_exam
JWT_SECRET=your_jwt_secret_key_here (I used node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" to generate secret key)
```

**Important:** Update `DB_PASSWORD` with your MySQL password.

### 4. Initialize Database Tables

The tables will be created automatically when you start the server for the first time.

### 5. Seed Test User

Run the seeder to create a test user:

```bash
npm run seed
```

This creates a user with:
- Email: `test@jlabs.com`
- Password: `password123`

### 6. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:8000`

## API Endpoints

### 1. Login
- **URL:** `POST /api/login`
- **Body:**
  ```json
  {
    "email": "test@jlabs.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "test@jlabs.com"
    }
  }
  ```

### 2. Save Search History
- **URL:** `POST /api/history`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "ip_address": "8.8.8.8",
    "geo_data": {
      "city": "Mountain View",
      "country": "US"
    }
  }
  ```

### 3. Get Search History
- **URL:** `GET /api/history`
- **Headers:** `Authorization: Bearer {token}`

### 4. Delete History Items
- **URL:** `DELETE /api/history`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```

## Project Structure

```
[fileName]/
├── config/
│   └── database.js      # Database connection and initialization
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   └── api.js           # API route handlers
├── seeders/
│   └── userSeeder.js    # Database seeder for test user
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── server.js            # Main application entry point
```

## Technologies Used

- **Express.js** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management