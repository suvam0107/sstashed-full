# Stashed - Marketplace for Rural Artisans

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)

**Stashed** is a robust full-stack e-commerce platform designed to bridge the gap between rural artisans and the global market. By eliminating middlemen, this application empowers artisans to list their handcrafted goods directly, ensuring fair pricing and wider visibility, while providing customers with unique, authentic products.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Authors](#-authors)

## ✨ Features

* **User Roles:** Distinct flows for Customers, Artisans, and Administrators.
* **Product Management:** Artisans can CRUD (Create, Read, Update, Delete) their product listings.
* **Authentication:** Secure login and registration system.
* **Shopping Cart:** Persistent cart management for customers.
* **Order Processing:** Streamlined checkout and order tracking.
* **Responsive Design:** Optimized for both desktop and mobile devices.

## 🛠 Tech Stack

### Backend
* **Java** (JDK 25)
* **Spring Boot** (Web, Data JPA, Security)
* **Database:** MySQL (Configurable via properties)
* **Build Tool:** Maven

### Frontend
* **React.js** (Vite)
* **State Management:** Context API
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios

## 🏗 System Architecture

The application follows a standard MVC architecture decoupled into a RESTful API and a Single Page Application (SPA).

1.  **Client:** React frontend running on `localhost:5173`.
2.  **Server:** Spring Boot backend running on `localhost:8008`.
3.  **Database:** Relational database for persistent storage.

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
* Java Development Kit (JDK 25)
* Node.js (v22)
* Maven
* Oracle 10g XE or MySQL Server

### Backend Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/suvam0107/stashed.git](https://github.com/suvam0107/stashed.git)
    cd stashed/backend
    ```

2.  **Configure Database**
    Update `src/main/resources/application.properties` with your database credentials:
    ```properties
    spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    server.port=8008
    ```

3.  **Build and Run**
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

### Frontend Setup

1.  **Navigate to frontend directory**
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application should now be accessible at `http://localhost:5173`.

## 🔧 Troubleshooting

* **Fast Refresh Issues (React):** If you encounter circular import errors or fast refresh loops, ensure your component filenames match their export names exactly (case-sensitive).
* **CORS Errors:** If you see `Access to XMLHttpRequest has been blocked by CORS policy`, verify that the `@CrossOrigin` annotation in the backend matches your frontend's running port exactly.
* **Database Connection:** Ensure the Oracle/MySQL service is running before starting the Spring Boot application.

## 👥 Authors

* **Suvam Roy** - [@suvam0107](https://github.com/suvam0107)
* **Sutirtha Bose** - [@sidbose04](https://github.com/sidbose04)
