# 📚 Online Quiz System

A full-stack Online Quiz Management System built with Node.js, Express, MySQL, React (Vite), and Tailwind CSS.
It allows teachers to create quizzes, add questions/options, and view student attempts. Students can attempt quizzes, submit answers, and view their results.

---

## 🚀 Tech Stack

### ✡️ Frontend

React.js (Vite)

Tailwind CSS

React Router DOM

Fetch API for making HTTP requests


### 🚀 Backend

Node.js

Express.js

JWT Authentication

bcrypt for hashing

Restful API development (GET, POST, PUT routes)


### 🗄️ Database

MySQL

---

## 📌 Features

### 🧩 General System Features

Secure JWT authentication

Role-based access (Teacher/Student)

Fully responsive UI using Tailwind

Clean and modular API structure

Error handling for smooth UX


### 👨‍🏫 Teacher Features

Create quizzes

Add/edit questions

Add/edit options for each question

View all attempts for each quiz

Review answers submitted by students


### 👩‍🎓 Student Features

View available quizzes

Attempt quizzes with MCQs

Navigate between questions

View attempts & answers + Best Score 

---

## 📁 Project Structure

### 🚀 Backend (Node + Express)

backend/
│── config/
│── controllers/
│── middleware/
│── public/
│── routes/
│── index.js


### ⚛️ Frontend (React + Vite)

frontend/
├── components/
├── helpers/
├── public/
├── src/ 
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│── index.html


### 🗃️ Database Schema (Main Tables)

User

Quiz

Question

Options

Attempt

Answer


Designed with foreign key relationships for consistency.

---

## ▶️ Running the Project

### Clone the repo

```
git clone https://github.com/und3fined-dev/OnlineQuizSystem
cd online_quiz_system
```

---

### Backend Setup

```
cd backend
npm install
```

Create a .env file:

```
PORT=3000
JWT_SECRET=your_secret
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=quizsystem
```

Run backend:

```
npm start
```


---

Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

🎨 UI Highlights

Clean layout powered by Tailwind CSS

Responsive design

Reusable components (QuestionCard etc.)

