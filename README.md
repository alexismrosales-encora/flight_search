# Flight Search Application

This is a project for my second Breakable Toy at the Spark Program.
A full-stack web application designed for efficient flight search.

## Project Structure

```
flight_search/
├── backend/       # Java 21 + Spring Boot REST API
├── client/        # React + TypeScript + Vite frontend
├── docker-compose.yml
├── Dockerfile
└── README.md
```

### Backend (`/backend`)

* **Language & Framework**: Java 21 with Spring Boot
* **Purpose**: Exposes RESTful APIs for flight inventory management
* **Build Tool**: Maven or Gradle (depending on your setup)

### Frontend (`/client`)

* **Framework**: React with TypeScript
* **Bundler**: Vite
* **Purpose**: Provides an intuitive UI for display searched flights

## Docker setup

To build and run the entire application using Docker Compose:

```bash
docker-compose up --build
```

This command will:

* Build both the backend and frontend services
* Start the containers and link them as defined in `docker-compose.yml`

Ensure you have Docker and Docker Compose installed on your machine.

## Technologies Used

* **Backend**: Java 21, Spring Boot
* **Frontend**: React, TypeScript, Vite
* **Containerization**: Docker, Docker Compose

## Repository

Access the full source code here: [alexismrosales-encora/flight\_search](https://github.com/alexismrosales-encora/flight_search)

