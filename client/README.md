# Frontend - Flight Search Application

## Overview

This frontend application is built using **React** and **TypeScript**, powered by **Vite**.
It provides an intuitive interface for searching flight offers through the **Amadeus Test API**, allowing users to search for various types of flights with different parameters and view detailed flight information.

## Technologies

* **React**
* **TypeScript**
* **Vite**
* **Vitest** for testing
* **Axios**, **Material UI**, etc.

## Setup Instructions

1. Ensure **Node.js** (v22 or later) and **npm** are installed.
2. Clone the repository to your local machine.
3. Navigate to the `client/` directory.
4. Create a `.env.dev` file and add the following environment variable:

   ```env
   VITE_API_BASEURL=http://localhost:8080
   ```

   This sets the base URL for API requests during development.

## Running the Application

To start the application in development mode, run:

```bash
npm run start
```

This command starts Vite and serves the application on the default port `5173`.

## Running Tests

To run all tests using Vitest, execute:

```bash
npm run test
```

This command runs all unit and integration tests and displays the results in the console.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This compiles the TypeScript code and builds the optimized application using Vite.

## Developer Notes

* The project follows a modular, component-based architecture.
* API requests are made via Axios to the backend using the configured base URL.
* Use the `.env.dev` file to configure local environment variables.
* Maintain a consistent code style and adhere to best practices.
* The development server runs on port `5173`.
