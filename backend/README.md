# Backend - Flight Search Application

## Overview

This backend application is built using **Java 21** and **Spring Boot**, with **Gradle** as the build tool.
It provides a REST API for searching flights by communicating with the **Amadeus Test API**.
The architecture follows a clean 3-layered structure: `Controller → Service → Client`.

## Technologies
* **Java 21**
* **Spring Boot**
* **Gradle**

## Setup Instructions

1. Ensure you have **Java 21** and **Gradle** installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the `backend/` directory.
4. Create a `.dev.env` file in the `backend/` directory with the required environment variables (e.g., Amadeus credentials).

## Running the Application

To start the backend application, run:

```bash
./gradlew bootRun
```

This will start the Spring Boot application on port `8080`.

## Running Tests

To execute all tests for the backend application, run:

```bash
./gradlew test
```

This will run the unit and integration tests and display the results in the console.

## Developer Notes

* All API endpoints are prefixed with:

  ```
  /api/search
  ```
* The project uses a 3-layered structure:

  * `Controller`: Exposes REST endpoints.
  * `Service`: Contains business logic and input validation.
  * `Client`: Handles communication with the Amadeus Test API.
* The application **does not use a JPA repository** or database.
* Make sure to define all required credentials and configuration in `.dev.env`.
* Keep code clean and modular for easy maintenance and extension.
