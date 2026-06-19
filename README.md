# ApplyDrive: Job Aggregator & Off-Campus Hiring Platform

ApplyDrive is a high-performance, enterprise-grade job aggregator and off-campus recruitment platform designed to curate, organize, and streamline off-campus hiring opportunities. The application is built using a highly secure decoupled architecture featuring React SPA client portals and a robust Spring Boot REST API backend.

---

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 3.3.0" />
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18.3.1" />
  <img src="https://img.shields.io/badge/Vite-5.2.11-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Table of Contents
1. [Key Features](#key-features)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Directory Map](#project-directory-map)
5. [Local Development Setup](#local-development-setup)
6. [Environment Configurations](#environment-configurations)
7. [Dockerization Guide](#dockerization-guide)
8. [Production Deployment Topologies](#production-deployment-topologies)
9. [API Endpoint Specifications](#api-endpoint-specifications)

---

## Key Features

*   **Secure Sessions & Authentication**: JWT authentication utilizing secure, stateless HTTP-Only cookies (`accessToken` and `refreshToken`) for robust mitigation of Cross-Site Scripting (XSS) and Session hijacking risks.
*   **Double Portal Architecture**: Decoupled interface supporting both a Student Public Portal (for searching jobs, uploading resumes, tracking applications) and a comprehensive Admin Console.
*   **Dynamic Job Ingestion**: Custom scraper and importer service to ingest off-campus job drives dynamically from external feeds and listings.
*   **Admin Command & Analytics**: Admin dashboard for toggling user active status, registering partner companies, and monitoring candidate metrics.
*   **Cloud Image/Resume Hosting**: High-speed resume uploads and company logo mapping integrated directly with Cloudinary APIs.
*   **Real-time Synchronization**: Robust caching and synchronization services for efficient data fetching and minimal database load.

---

## Architecture Overview

The following diagram illustrates the network flow, security boundary, and service communication of the ApplyDrive platform:

```mermaid
graph TD
    subgraph Client Tier [Client Tier]
        PublicClient[Student Portal - React SPA]
        AdminClient[Admin Portal - React SPA]
    end

    subgraph API Gateway / Router [Nginx Router]
        Router{Nginx Proxy / Docker}
        PublicClient -->|Path: /portal| Router
        AdminClient -->|Path: /admin| Router
    end

    subgraph Application Tier [Spring Boot Backend]
        API[Spring Boot REST Controllers]
        SecurityChain[Spring Security & JWT Filters]
        Services[Job, Company, User & Sync Services]
        
        Router -->|API Proxy: /api/v1/**| API
        API <--> SecurityChain
        API <--> Services
    end

    subgraph Infrastructure & Integrations [External Services]
        DB[(MySQL Relational DB)]
        Cloudinary[Cloudinary CDN Store]
        SMTP[Brevo SMTP Server]
        Scraper[External Off-Campus Feeds]

        Services <-->|Spring Data JPA / Hikari| DB
        Services --->|Upload API / SDK| Cloudinary
        Services -.->|Transaction Mails| SMTP
        Services --->|Ingestion Job| Scraper
    end

    style Router fill:#646CFF,stroke:#fff,stroke-width:2px,color:#fff
    style Client Tier fill:#1b1b1f,stroke:#333,stroke-width:1px,color:#fff
    style Application Tier fill:#222,stroke:#6DB33F,stroke-width:2px,color:#fff
    style Infrastructure & Integrations fill:#1b1b1f,stroke:#333,stroke-width:1px,color:#fff
```

---

## Technology Stack

### Backend Technologies
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | ![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | Core application runtime environment (Java 17) |
| **Framework** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.0-6DB33F?style=flat-square&logo=spring-boot&logoColor=white) | Core REST API backend architecture (v3.3.0) |
| **Security** | ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=spring-security&logoColor=white) | Stateless authentication using JWT cookies & Custom filters |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Main relational database management system |
| **ORM** | ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white) | Data access layer, entity mappings and query parsing |
| **Build System** | ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apache-maven&logoColor=white) | Project dependencies compilation and builder |
| **Cloud CDN** | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Distributed media upload hosting API for resumes and logos |
| **Mail Dispatcher** | ![Brevo](https://img.shields.io/badge/Brevo-3C4DF3?style=flat-square&logo=brevo&logoColor=white) | SMTP mailing engine configuration for transactional mailings |

### Frontend Technologies
| Component | Technology | Description |
| :--- | :--- | :--- |
| **SPA Library** | ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black) | Component-driven user interface rendering (v18.3.1) |
| **Build Engine** | ![Vite](https://img.shields.io/badge/Vite-5.2.11-646CFF?style=flat-square&logo=vite&logoColor=white) | Bundler & high-speed development server (v5.2.11) |
| **Style Sheet** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Utility-first responsive design spacing layout guidelines (v3.4.4) |
| **UI Components** | ![HeroUI](https://img.shields.io/badge/HeroUI-React-FF5A5F?style=flat-square&logo=react&logoColor=white) | Beautifully crafted premium React UI components (`@heroui/react`) |
| **Data Fetching** | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.40.1-FF4154?style=flat-square&logo=react-query&logoColor=white) | Declarative state management and asynchronous data queries |
| **State Manager** | ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) | Global state container for token synchronizations and user info |
| **Animations** | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40.0-F107A3?style=flat-square&logo=framer&logoColor=white) | Fluid web interactions and layout transition triggers |

---

## Project Directory Map

This repository is optimized for API development. Git tracking is strictly restricted to protect sensitive workspace configurations and isolate frontend UI code:

```text
├── frontend/                  # React Frontend Applications
│   ├── public-portal/         # Student portal files
│   │   └── src/services/      # HTTP client API Integrations (staged)
│   ├── admin-portal/          # Admin portal files
│   │   └── src/services/      # Admin client API Integrations (staged)
│   ├── package.json           # Frontend dependency manifest
│   ├── tailwind.config.js     # Styles design token configuration
│   └── Dockerfile             # Multi-stage production Nginx serve file
│
└── spring-backend/            # Spring Boot Backend REST Service
    ├── src/main/java/com/jobportal/
    │   ├── config/            # CORS configuration, database seeder config
    │   ├── controller/        # REST Controllers (Auth, Jobs, Company)
    │   ├── dto/               # Request & Response Data Transfer Objects
    │   ├── entity/            # Hibernate Entity Definitions
    │   ├── mapper/            # ModelMapper conversions
    │   ├── repository/        # Spring Data JPA Repository interfaces
    │   ├── security/          # Spring Security, JWT validation and cookie parsers
    │   └── service/           # Service interfaces & implementations
    ├── src/main/resources/
    │   ├── application.yml    # Main environment configurations
    │   └── application.yml.example # Template environment config placeholders
    ├── Dockerfile             # Multi-stage containerization build file
    └── pom.xml                # Maven build dependencies config
```

---

## Local Development Setup

### Prerequisite Checklist
*   **Java:** JDK 17 installed
*   **NodeJS:** Version 18 or higher (along with npm)
*   **Database:** MySQL Server instance running locally

### Running the Backend
1. Create a MySQL database instance named `job_aggregator_db`:
   ```sql
   CREATE DATABASE job_aggregator_db;
   ```
2. Navigate to `spring-backend/src/main/resources`.
3. Copy `application.yml.example` to `application.yml`:
   ```bash
   cp application.yml.example application.yml
   ```
4. Fill in your credentials inside `application.yml` (database user/pass, Cloudinary credentials, and Brevo SMTP details).
5. Start the Spring Boot application using Maven:
   ```bash
   cd spring-backend
   mvn clean compile
   mvn spring-boot:run
   ```
The backend server starts by default on port `8080` with context path `/`.

### Running the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the Student Public Portal (accessible at `http://localhost:5173`):
   ```bash
   npm run dev:portal
   ```
4. Run the Admin Portal (accessible at `http://localhost:5174`):
   ```bash
   npm run dev:admin
   ```
Both ports are configured to proxy API requests to your local backend on port `8080`.

---

## Environment Configurations

For deployments or container overrides, configure the variables listed below inside your environment or docker container configurations:

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | MySQL Database Connection URL | `jdbc:mysql://localhost:3306/job_aggregator_db` |
| `SPRING_DATASOURCE_USERNAME`| Database Username | `root` |
| `SPRING_DATASOURCE_PASSWORD`| Database Password | `your_mysql_password` |
| `SPRING_MAIL_HOST` | SMTP Server Host Address | `smtp-relay.brevo.com` |
| `SPRING_MAIL_PORT` | SMTP Server Connection Port | `587` |
| `SPRING_MAIL_USERNAME` | SMTP Mail Account Username | `your_brevo_mail_username` |
| `SPRING_MAIL_PASSWORD` | SMTP Mail Account Password | `your_brevo_mail_password` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Cloud Name | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret Key | `your_api_secret` |
| `CLOUDINARY_FOLDER` | Cloudinary Uploads Folder | `job-app/images` |
| `JWT_SECRET` | Base64 JWT Secret Key | *Generate a secure Base64 256-bit string* |
| `PUBLIC_PORTAL_URL` | CORS Allowed Origin - Public Portal | `http://localhost:5173` |
| `ADMIN_PORTAL_URL` | CORS Allowed Origin - Admin Portal | `http://localhost:5174` |

---

## Dockerization Guide

### 1. Build the Docker Images
Navigate to the root directory and build the multi-stage images:

**Backend Image**:
```bash
cd spring-backend
docker build -t job-backend:latest .
```

**Frontend Image** (combines public and admin portals served by Nginx):
```bash
cd ../frontend
docker build -t job-frontend:latest .
```

### 2. Run with Environment Variables
1. Map Host Port `8080` to Container Port `8080` for the backend.
2. Supply environment variables like `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
3. Map Host Port `80` to Container Port `80` for the Nginx frontend. Access the public portal at `http://localhost/portal` and the admin portal at `http://localhost/admin`.

---

## Production Deployment Topologies

### Topology A: Unified JAR Distribution
To host both portals directly inside the backend JAR for a single-port deployment:
1. Navigate to the frontend directory and build the assets:
   ```bash
   cd frontend
   npm run build:portal
   npm run build:admin
   ```
2. Copy the production output assets into the Spring Boot resource folders:
   ```bash
   cp -r public-portal/dist/* ../spring-backend/src/main/resources/static/portal/
   cp -r admin-portal/dist/* ../spring-backend/src/main/resources/static/admin/
   ```
3. Build the unified JAR:
   ```bash
   cd ../spring-backend
   mvn clean package -DskipTests
   ```
4. Run the JAR:
   ```bash
   java -jar target/spring-backend-0.0.1-SNAPSHOT.jar
   ```
*Access the portals at `http://localhost:8080/portal/index.html` and `http://localhost:8080/admin/index.html`.*

### Topology B: Split Containers (Nginx + Spring) — Recommended
Run the Frontend container served by Nginx alongside the Backend container, mapping backend CORS policies to allow the production Nginx domain names.

---

## API Endpoint Specifications

### 🔐 Authentication Operations
*   `POST /api/v1/auth/register` — Create student account.
*   `POST /api/v1/auth/login` — Authenticate student user, returns stateless JWT HttpOnly cookies (`accessToken`, `refreshToken`).
*   `POST /api/v1/auth/refresh-token` — Request new `accessToken` using `refreshToken` cookie.
*   `POST /api/v1/auth/logout` — Evict client auth cookies and terminate session.

### 👤 Student Profiles (`/api/v1/users/**`)
*   `GET /api/v1/users/me` — Fetch currently logged-in student profile details.
*   `PUT /api/v1/users/me` — Update candidate profile metadata.

### 🏢 Partner Companies (`/api/v1/companies/**`)
*   `GET /api/v1/companies` — Retrieve listing of partner employers.
*   `POST /api/v1/companies` — Register a partner employer.

### 💼 Job Board Operations (`/api/v1/jobs/**` & `/api/v1/public/jobs/**`)
*   `GET /api/v1/public/jobs` — Paginated job listings search.
*   `GET /api/v1/jobs/{id}` — Fetch detailed job specification page.
*   `POST /api/v1/jobs/import` — Trigger the job scraper and ingestion feed engine.

### ☁️ Cloud File Uploads (`/api/v1/upload/**`)
*   `POST /api/v1/upload/resume` — Process resume PDF uploads directly to Cloudinary.
*   `POST /api/v1/upload/image` — Handle avatar and company brand logo uploads to Cloudinary.

### 🛡️ Admin Core Controllers (`/api/v1/admin/**`)
*   `POST /api/v1/admin/auth/login` — Authenticate administrative dashboard privileges.
*   `GET /api/v1/admin/dashboard/analytics` — Fetch aggregated metrics (sign-up trends, active counts, jobs categories).
*   `PATCH /api/v1/admin/users/{id}/status` — Toggle student account activation status (active vs. blocked).
