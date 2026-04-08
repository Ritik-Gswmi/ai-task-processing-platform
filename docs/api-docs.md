# API Documentation

Base URL

http://localhost:5000/api

Authentication uses JWT tokens.

---

## Register

POST /auth/register

Body:

{
"name": "Ritik",
"email": "[ritik@example.com](mailto:ritik@example.com)",
"password": "123456"
}

---

## Login

POST /auth/login

Body:

{
"email": "[ritik@example.com](mailto:ritik@example.com)",
"password": "123456"
}

---

## Create Task

POST /tasks

Headers

Authorization: Bearer TOKEN

Body

{
"type": "summarize",
"input": "Large text content"
}

---

## Get Tasks

GET /tasks

Returns all tasks created by the user.

---

## Task Status

GET /tasks/:id

Returns task result and status.
