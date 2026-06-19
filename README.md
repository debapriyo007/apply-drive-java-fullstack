# ApplyDrive: Job Aggregator & Off-Campus Hiring Platform

An industry-standard fullstack job aggregator and off-campus recruitment platform designed to curate, organize, and streamline off-campus hiring opportunities. The application is built using a highly secure, enterprise-grade architecture.

---

## 🛠️ Technology Stack & Architecture

### Backend (Spring Boot Core)
* **Core Framework**: Java 17, Spring Boot 3.3.0
* **Security & Authentication**: Spring Security 6, JWT (JSON Web Tokens)
* **Secure Token Delivery**: Cookie-based JWT mechanism featuring **HTTP-Only**, **Secure**, and **SameSite (Lax)** flags for complete mitigation of Cross-Site Scripting (XSS) and Session hijacking risks.
* **Data Access & Database**: Spring Data JPA, Hibernate, MySQL, HikariCP Connection Pooling
* **Storage Integrations**: Cloudinary API (image upload orchestration)
* **Database Seeding**: Automated idempotent startup seeds (`DatabaseInitializer`)

### Frontend Integration (API Layer)
* **Client Architecture**: Axios client integration configured with `withCredentials: true` to support automatic, browser-native forwarding of secure cookies.
* **Refresh Strategy**: Silent authentication interceptor matching backend `/refresh-token` flows to extend sessions seamlessly.

---

## 📦 Directory Structure & Tracking Policy

This repository is optimized for API development. Git tracking is strictly restricted to protect sensitive workspace config and isolate frontend logic:
* **`spring-backend/`**: Contains the full Spring Boot REST API application.
* **`frontend/`**: Under strict `.gitignore` filters. Only the core **API Services Layer** (`services/api.js`, mappers, query services) is pushed to maintain a decoupled front-end tracking boundary.

```
apply-drive-java-fullstack/
├── spring-backend/                 # Full Spring Boot Web Services
│   ├── src/main/java/com/jobportal/
│   │   ├── config/                 # CORS, Database Seeder, SecurityConfig
│   │   ├── controller/             # REST Endpoints (Auth, Jobs, Users, Companies)
│   │   ├── security/               # Custom UserDetails, JWT Filter, Cookie Parser
│   │   └── service/                # Business Logics (Auth, Scraping, Analytics)
│   └── src/main/resources/
│       └── application.yml.example # Template config with credential placeholders
├── frontend/
│   ├── public-portal/src/services/ # Shared public client services
│   └── admin-portal/src/services/  # Admin client api services
└── .gitignore                      # Workspace rules (ignores node_modules, target, credentials)
```

---

## 🔒 Security Configuration Highlights

### 1. HTTP-Only Cookie Tokens
When a user logs in, tokens are returned via response headers instead of the body, preventing Javascript access:
```java
ResponseCookie accessCookie = ResponseCookie.from("accessToken", jwt)
        .httpOnly(true)
        .secure(false) // Set to true in production SSL environments
        .path("/")
        .maxAge(12 * 60 * 60) // 12 hours
        .sameSite("Lax")
        .build();
```

### 2. Cookie Extraction Filter
Incoming client requests pass through a custom filter that extracts tokens from HTTP requests:
```java
jakarta.servlet.http.Cookie[] cookies = request.getCookies();
for (jakarta.servlet.http.Cookie cookie : cookies) {
    if ("accessToken".equals(cookie.getName())) {
        return cookie.getValue();
    }
}
```

---

## 🚀 Setup & Execution Guide

### Prerequisite Configurations
1. Create a MySQL database named `job_aggregator_db`.
2. Navigate to `spring-backend/src/main/resources`.
3. Copy `application.yml.example` to `application.yml`:
   ```bash
   cp application.yml.example application.yml
   ```
4. Open `application.yml` and fill in your local system credentials:
   - Database username & password
   - Brevo SMTP Mail username & password
   - Cloudinary integration keys

### Running the Backend REST Service
Navigate to the backend directory and compile/run the Maven project:
```bash
cd spring-backend
mvn clean compile
mvn spring-boot:run
```
The server starts up by default on port `8080` with context path `/`.

---

## 📡 REST API Endpoint Specifications

### Public Endpoints (`/api/v1/auth/**`, `/api/v1/public/**`)
* `POST /api/v1/auth/register` - Create new student account.
* `POST /api/v1/auth/login` - Authenticate account and write HTTP-only cookies.
* `POST /api/v1/auth/refresh-token` - Renew expired access tokens using secure cookies.
* `POST /api/v1/auth/logout` - Clear cookies and terminate session.
* `GET /api/v1/public/jobs` - Paginated job listings search.
* `POST /api/v1/public/upload` - Secure file upload mapping (resumes, avatars).

### Admin-Only Endpoints (`/api/v1/admin/**`)
* `POST /api/v1/admin/auth/login` - Admin console authentication.
* `GET /api/v1/admin/dashboard/analytics` - Grouped signup trends, active status counts, and top metrics.
* `POST /api/v1/admin/companies` - Register partner employers.
* `PATCH /api/v1/admin/users/{id}/status` - Manage student active/blocked status.
