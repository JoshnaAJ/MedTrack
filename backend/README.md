MedTrack Backend (minimal Spring Boot auth)

This is a minimal Spring Boot backend used for the MedTrack frontend demo. It provides simple auth endpoints using H2 in-memory DB and JWT tokens.

Requirements
- Java 11+
- Maven

Run

Open a terminal in this folder and run:

```powershell
mvn spring-boot:run
```

The server will start on port 8081.

Endpoints
- POST /api/auth/register  -- body: { "name":"...", "email":"...", "password":"..." }
- POST /api/auth/login     -- body: { "email":"...", "password":"..." }

Example curl

```powershell
curl -X POST http://localhost:8081/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"pass123"}'
curl -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"pass123"}'
```

Notes
- This is a demo. The JWT secret is hard-coded and not secure for production.
- The H2 DB is in-memory and resets on restart.
