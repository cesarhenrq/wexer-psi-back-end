# Wexer-psi Back-end

Patient and Records Management

## 🚀 Starting

These instructions will allow you to get a working copy of the project on your local machine for development and testing purposes.

See [Deployment](#section-deployment) for notes on how to deploy the project in production.

### 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment

### 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/cesarhenrq/wexer-psi-back-end.git
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and fill in the environment variables:

```bash
# Server
PORT= The port where the server will run

# Database
DATABASE_URL= The URL of the database

# Authentication
SECRET_KEY= The secret key for JWT authentication
```

4. Run the application:

```bash
npm start
```

or

```bash
npm run dev
```

## ⚙️ Running the tests

To run the tests, run the following command:

```bash
npm test
```

There are 2 types of tests:

- Unit tests
- Integration tests

## 📦 <a name="section-deployment"></a> Deployment

To deploy the application, run the following command:

```bash
npm run build
```

This command will generate a `dist` folder containing the compiled code.

## 🛠️ Built with

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [Jest](https://jestjs.io/) - JavaScript Testing Framework
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP assertions
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password encryption
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Authentication
- [Multer](https://www.npmjs.com/package/multer) - File upload
- [Dotenv](https://www.npmjs.com/package/dotenv) - Environment variables
- [Prettier](https://prettier.io/) - Code formatter

## 📄 Description of database entities

### 👨‍⚕️ Entity "User"

The "User" entity represents the users of the system.

#### 📋 Attributes

| Name      | Type     | Required | Unique | Description               |
| --------- | -------- | -------- | ------ | ------------------------- |
| name      | String   | Yes      | No     | Username                  |
| email     | String   | Yes      | Yes    | User email address        |
| password  | String   | Yes      | No     | User password (encrypted) |
| photo     | ObjectId | No       | No     | Profile picture id        |
| createdAt | Date     | Default  | No     | Record creation date      |
| updatedAt | Date     | Default  | No     | Record update date        |

#### 📌 Example

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "name": "John Doe",
  "email": "jhondoe@example.com",
  "photo": "60a2a68c7b4f4d004e9a25e1",
  "password": "***********",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

### 🙍‍♂️ Entity "Patient"

The entity "Patient" represents the patients registered in the system.

#### 📋 Attributes

| Name                | Type       | Required | Unique | Description                      |
| ------------------- | ---------- | -------- | ------ | -------------------------------- |
| user                | ObjectId   | Yes      | No     | Record Owner User ID             |
| timelines           | ObjectId[] | Yes      | No     | Patient timelines ID's           |
| name                | String     | Yes      | No     | Patient name                     |
| contact             | String     | Yes      | No     | Patient contact (Phone/E-mail)   |
| birthdate           | Date       | Yes      | No     | Patient's date of birth          |
| demands             | String     | No       | No     | Patient demands for treatment    |
| personalAnnotations | String     | No       | No     | Personal notes about the patient |
| createdAt           | Date       | Default  | No     | Record creation date             |
| updatedAt           | Date       | Default  | No     | Record update date               |

#### 📌 Example

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": [
    "60a2a68c7b4f4d004e9a25d9"
  ],
  "name": "John Doe",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

### 📂 Entity "Timeline"

The "Timeline" entity represents the timelines related to the patients registered in the system.

#### 📋 Attributes

| Name        | Type       | Required | Unique | Description               |
| ----------- | ---------- | -------- | ------ | ------------------------- |
| name        | String     | Yes      | No     | Timeline name             |
| occurrences | ObjectId[] | Yes      | No     | Timeline occurrences ID's |
| createdAt   | Date       | Default  | No     | Record creation date      |
| updatedAt   | Date       | Default  | No     | Record update date        |

#### 📌 Example

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": [
    "60a2a68c7b4f4d004e9a25d9",
    "60a2a68c7b4f4d004e9a25da",
    "60a2a68c7b4f4d004e9a25db"
  ],
  "name": "Physiotherapy",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

### 📝 Entity "Occurrence"

The entity "Occurrence" represents an occurrence of a therapy session or a relevant fact about a patient. It contains information such as title, content, type and attachment files.

#### 📋 Attributes

| Name      | Type       | Required | Unique | Description              |
| --------- | ---------- | -------- | ------ | ------------------------ |
| name      | String     | Yes      | No     | Occurrence name          |
| content   | String     | Yes      | No     | Occurrence description   |
| kind      | String     | Yes      | No     | Session or Relevant Fact |
| files     | ObjectId[] | Yes      | No     | files ID's               |
| createdAt | Date       | Default  | No     | Record creation date     |
| updatedAt | Date       | Default  | No     | Record update date       |

#### 📌 Example

```javascript
{
  "name": "Session 1",
  "content": "Today we talked about...",
  "kind": "session",
  "files": [
    "61711d13c799a3347f3ec6f3"
  ],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

### 📁 Entity "File"

The "File" entity represents the files in the system, being occurrence files or profile picture

#### 📋 Attributes

| Name      | Type   | Required | Unique | Description          |
| --------- | ------ | -------- | ------ | -------------------- |
| filename  | String | Yes      | No     | File name            |
| mimetype  | String | Yes      | No     | File extension       |
| createdAt | Date   | Default  | No     | Record creation date |
| updatedAt | Date   | Default  | No     | Record update date   |

#### 📌 Example

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "filename": "file.png",
  "mimetype": "image/png",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## 🗃️ Entity Diagram

![diagram](https://uploaddeimagens.com.br/images/004/529/170/original/Diagrama_em_branco.jpeg?1688339242)

## 📌 API Routes

### ✅ Authentication

| Method | Route | Description         |
| ------ | ----- | ------------------- |
| POST   | /auth | Authenticate a user |

### 👨‍⚕️ User

| Method | Route               | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | /users              | Register a new user               |
| PATCH  | /users/:id          | Update user informations          |
| DELETE | /users/:id          | Delete a user                     |
| GET    | /users/:id/patients | Get all the patients from an user |

### 🙍‍♂️ Patient

| Method | Route                   | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | /patients               | Register a new patient      |
| GET    | /patients:id            | Get a patient by its id     |
| PATCH  | /patients/:id           | Update patient informations |
| DELETE | /patients/:id           | Delete a patient            |
| GET    | /patients/:id/timelines | Get all the timelines       |

### 📂 Timeline

| Method | Route                              | Description                  |
| ------ | ---------------------------------- | ---------------------------- |
| POST   | /timelines:patientId               | Register a new timeline      |
| GET    | /timelines/:id                     | Get a timeline by its id     |
| PATCH  | /timelines/:id                     | Update timeline informations |
| DELETE | /timelines/:id/patients/:patientId | Delete a timeline            |
| GET    | /timelines/:id/occurrences         | Get all the occurrences      |

### 📝 Occurrence

| Method | Route                                  | Description                    |
| ------ | -------------------------------------- | ------------------------------ |
| POST   | /occurrences:timelineId                | Register a new occurrence      |
| GET    | /occurrences/:id                       | Get an occurrence by its id    |
| PATCH  | /occurrences/:id                       | Update occurrence informations |
| DELETE | /occurrences/:id/timelines/:timelineId | Delete an occurrence           |

#### Public routes

- [POST] /auth
- [POST] /users

#### Private routes

- [PATCH] /users/:id
- [DELETE] /users/:id
- [GET] /users/:id/patients
- [POST] /patients
- [GET] /patients/:id
- [PATCH] /patients/:id
- [DELETE] /patients/:id
- [GET] /patients/:id/timelines
- [POST] /timelines/:patientId
- [GET] /timelines/:id
- [PATCH] /timelines/:id
- [DELETE] /timelines/:id/patients/:patientId
- [GET] /timelines/:id/occurrences
- [POST] /occurrences/:timelineId
- [GET] /occurrences/:id
- [PATCH] /occurrences/:id
- [DELETE] /occurrences/:id/timelines/:timelineId

## 📌 API Documentation

### ✅ Authentication

#### POST /auth

Authenticate a user

##### Request

```http
POST /auth
```

##### Body

```json
{
  "email": "johndoe@email.com",
  "password": "123456"
}
```

##### Response

```json
{
  "user": {
    "_id": "60a2a68c7b4f4d004e9a25d9",
    "name": "John Doe",
    "email": "johndoe@email.com",
    "password": "***********",
    "photo": "60a2a68c7b4f4d004e9a25e1",
    "createdAt": "2021-05-17T18:30:00.000Z",
    "updatedAt": "2021-05-17T18:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTI2OGM3YjRmNGQwMDRlOWEyNWQ5IiwiaWF0IjoxNjIwMjQ0NjQ4LCJleHAiOj"
}
```

### 👨‍⚕️ User

#### POST /users

Register a new user

##### Request

```http
POST /users
```

##### Body

```json
{
  "name": "John Doe",
  "email": "johndoe@email.com"
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "name": "John Doe",
  "email": "johndoe@email.com",
  "password": "***********",
  "photo": "60a2a68c7b4f4d004e9a25e1",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### PATCH /users/:id

Update user informations

##### Request

```http
PATCH /users/60a2a68c7b4f4d004e9a25d9
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "John Doe 2"
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "name": "John Doe 2",
  "email": "johndoe@email.com",
  "password": "***********",
  "photo": "60a2a68c7b4f4d004e9a25e1",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### DELETE /users/:id

Delete a user

##### Request

```http
DELETE /users/60a2a68c7b4f4d004e9a25d9
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "name": "John Doe",
  "email": "johndoe@email.com",
  "password": "***********",
  "photo": "60a2a68c7b4f4d004e9a25e1",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /users/:id/patients

Get all the patients from an user

##### Request

```http
GET /users/60a2a68c7b4f4d004e9a25d9/patients
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
[
  {
    "_id": "60a2a68c7b4f4d004e9a25d8",
    "user": "60a2a68c7b4f4d004e9a25d9",
    "timelines": ["60a2a68c7b4f4d004e9a25d9"],
    "name": "John Doe",
    "birthdate": "1980-01-01T00:00:00.000Z",
    "contact": "(21) 99999-8888",
    "demands": "Back pain",
    "personalAnnotations": "Patient with a history of back problems.",
    "createdAt": "2021-05-17T18:30:00.000Z",
    "updatedAt": "2021-05-17T18:30:00.000Z"
  }
]
```

### 🙍‍♂️ Patient

#### POST /patients

Register a new patient

##### Request

```http
POST /patients
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "user": "60a2a68c7b4f4d004e9a25d9",
  "name": "John Doe",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems."
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": [],
  "name": "John Doe",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /patients/:id

Get a patient by its id

##### Request

```http
GET /patients/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "John Doe",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### PATCH /patients/:id

Update patient informations

##### Request

```http
PATCH /patients/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "John Doe 2"
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "John Doe 2",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### DELETE /patients/:id

Delete a patient

##### Request

```http
DELETE /patients/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25d8",
  "user": "60a2a68c7b4f4d004e9a25d9",
  "timelines": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "John Doe 2",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /patients/:id/timelines

Get all the timelines

##### Request

```http
GET /patients/60a2a68c7b4f4d004e9a25d8/timelines
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
[
  {
    "_id": "60a2a68c7b4f4d004e9a25e1",
    "occurrences": ["60a2a68c7b4f4d004e9a25d9"],
    "name": "Physiotherapy",
    "createdAt": "2021-05-17T18:30:00.000Z",
    "updatedAt": "2021-05-17T18:30:00.000Z"
  }
]
```

### 📂 Timeline

#### POST /timelines/:patientId

Register a new timeline

##### Request

```http
POST /timelines/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "Physiotherapy"
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": [],
  "name": "Physiotherapy",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /timelines/:id

Get a timeline by its id

##### Request

```http
GET /timelines/60a2a68c7b4f4d004e9a25e1
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "Physiotherapy",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### PATCH /timelines/:id

Update timeline informations

##### Request

```http
PATCH /timelines/60a2a68c7b4f4d004e9a25e1
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "Physiotherapy 2"
}
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "Physiotherapy 2",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### DELETE /timelines/:id/patients/:patientId

Delete a timeline

##### Request

```http
DELETE /timelines/60a2a68c7b4f4d004e9a25e1/patients/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "_id": "60a2a68c7b4f4d004e9a25e1",
  "occurrences": ["60a2a68c7b4f4d004e9a25d9"],
  "name": "Physiotherapy 2",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /timelines/:id/occurrences

Get all the occurrences

##### Request

```http
GET /timelines/60a2a68c7b4f4d004e9a25e1/occurrences
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
[
  {
    "name": "Session 1",
    "content": "Today we talked about...",
    "kind": "session",
    "files": ["61711d13c799a3347f3ec6f3"],
    "createdAt": "2021-05-17T18:30:00.000Z",
    "updatedAt": "2021-05-17T18:30:00.000Z"
  }
]
```

### 📝 Occurrence

#### POST /occurrences/:timelineId

Register a new occurrence

##### Request

```http
POST /occurrences/60a2a68c7b4f4d004e9a25e1
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "Session 1",
  "content": "Today we talked about...",
  "kind": "session",
  "files": ["61711d13c799a3347f3ec6f3"]
}
```

##### Response

```json
{
  "name": "Session 1",
  "content": "Today we talked about...",
  "kind": "session",
  "files": ["61711d13c799a3347f3ec6f3"],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### GET /occurrences/:id

Get an occurrence by its id

##### Request

```http
GET /occurrences/60a2a68c7b4f4d004e9a25e1
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "name": "Session 1",
  "content": "Today we talked about...",
  "kind": "session",
  "files": ["61711d13c799a3347f3ec6f3"],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### PATCH /occurrences/:id

Update occurrence informations

##### Request

```http
PATCH /occurrences/60a2a68c7b4f4d004e9a25e1
```

#### Headers

```http
Authorization Bearer <token>
```

##### Body

```json
{
  "name": "Session 2"
}
```

##### Response

```json
{
  "name": "Session 2",
  "content": "Today we talked about...",
  "kind": "session",
  "files": ["61711d13c799a3347f3ec6f3"],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

#### DELETE /occurrences/:id/timelines/:timelineId

Delete an occurrence

##### Request

```http
DELETE /occurrences/60a2a68c7b4f4d004e9a25e1/timelines/60a2a68c7b4f4d004e9a25d8
```

#### Headers

```http
Authorization Bearer <token>
```

##### Response

```json
{
  "name": "Session 2",
  "content": "Today we talked about...",
  "kind": "session",
  "files": ["61711d13c799a3347f3ec6f3"],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## 📌 API Errors

### 400 Bad Request

- Invalid JSON
- Invalid request body
- Invalid request parameters
- Invalid request query
- Invalid request headers

### 401 Unauthorized

- Invalid token
- Token not provided

### 404 Not Found

- Resource not found

### 500 Internal Server Error

- Internal server error

## 📌 API Responses

### 200 OK

- Successful request

### 201 Created

- Successful request with resource creation

### 400 Bad Request

- Invalid JSON
- Invalid request body
- Invalid request parameters
- Invalid request query
- Invalid request headers

### 401 Unauthorized

- Invalid token
- Token not provided

### 404 Not Found

- Resource not found

### 500 Internal Server Error

- Internal server error

## ✒️ Authors

- Development - [César Henrique](https://www.github.com/cesarhenrq)
- Documentation - [César Henrique](https://www.github.com/cesarhenrq)

## 📄 License

This project is under the license [MIT](https://opensource.org/licenses/MIT)
