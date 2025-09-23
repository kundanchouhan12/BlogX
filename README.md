
# BlogX
BlogX is a modern blogging platform that allows users to create, manage, and interact with blog posts.
The project features a React frontend with a Spring Boot backend, complete with JWT-based authentication,
rich text editing, and image handling.

---

## Table of Contents
- [Live Demo](#live-demo)
- [Features](#features)
- [Technologies & Libraries](#technologies--libraries)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [State Management](#state-management)
- [Setup & Installation](#setup--installation)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## Live Demo

Check out the live demo of BlogX here: [https://reliable-babka-51e941.netlify.app/](https://reliable-babka-51e941.netlify.app/)

---

## Features

- User signup/login with JWT authentication
- Create, update, and delete posts
- Rich Text content support (HTML output)
- Image upload and preview using Cloudinary
- post categories
- Comment system: add, edit, delete
- Author-only actions for posts and comments
- Responsive design with modern UI

---

## Technologies & Libraries

### Frontend (React)
- **React 17** – UI building framework  
- **React Router Dom** – Routing between pages (`/`, `/create-post`, `/update-post`, `/blog/:id`)  
- **Vite** – Bundler & build tool (faster than CRA)  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **Mantine Rich Text Editor (`@mantine/rte`)** – WYSIWYG editor for blog posts  
- **React Icons (`react-icons`)** – For icons like `FaArrowLeft`  
- **DOMPurify** – Sanitize HTML from Rich Text Editor to prevent XSS  
- **Axios** – HTTP client for API calls  

### Backend (Spring Boot / Java)
- **Java + Spring Boot** – Backend API and server  
- **Spring Security** – Authentication & authorization  
- **JWT (JSON Web Tokens)** – Token-based authentication  
- **PostgreSQL** – Database for users, posts, comments  
- **Cloudinary** – Image storage & handling  
- **Spring Data JPA** – ORM for database entities  
- **Maven** – Dependency management  

### State Management / Context
- **React Context API**  
  - `AuthContext` – Manage user authentication state  
  - `PostsContext` – Manage posts state  

---

## Setup & Installation

### Frontend
```bash
cd frontend
npm install
npm run dev

Backend
cd backend
mvn clean install
mvn spring-boot:run


Make sure to configure your .env or application.properties with database credentials, JWT secret, and Cloudinary keys.

Folder Structure (Frontend)
src/
 ├─ components/       # Reusable UI components
 ├─ context/          # React Context for state management
 ├─ pages/            # Page components (Home, Login, CreatePost, etc.)
 ├─ services/         # API service functions
 └─ App.jsx

Folder Structure (Backend)
src/main/java/com/blogxapplication/blogx/
 ├─ controller/       # API endpoints
 ├─ model/            # Database entities
 ├─ repository/       # JPA repositories
 ├─ security/         # JWT & Spring Security config
 └─ service/          # Business logic

Environment Variables
Frontend (.env)
VITE_BACKEND_URL=https://your-backend-url.com

Backend (application.properties or .env)
spring.datasource.url=jdbc:postgresql://<DB_HOST>:<DB_PORT>/<DB_NAME>
spring.datasource.username=<DB_USERNAME>
spring.datasource.password=<DB_PASSWORD>

jwt.secret=<YOUR_JWT_SECRET>
blogx.app.jwtExpirationMs=86400000

cloudinary.cloud_name=<YOUR_CLOUDINARY_CLOUD_NAME>
cloudinary.api_key=<YOUR_CLOUDINARY_API_KEY>
cloudinary.api_secret=<YOUR_CLOUDINARY_API_SECRET>


Replace placeholders (<...>) with your actual credentials.

Screenshots
Home Page

Create Post Page

Post Details

Contributing

Fork the repository

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

Please follow best practices and ensure code is well-documented.

License

This project is licensed under the MIT License.
