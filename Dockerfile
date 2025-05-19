# Stage Base
FROM node:22-alpine as base

######### CLIENT STAGE ############
# Stage: base-client

# Setting workdir inside the container
WORKDIR /app

# Copying dependencies definition
FROM base AS client-base
COPY client/package.json client/package-lock.json ./client/

# Installing dependencies
RUN --mount=type=cache,target=/home/node/.npm \
    npm ci --prefix ./client --prefer-offline --no-audit

# Copying important files
COPY client/vite.config.ts ./client/
COPY client/index.html ./client/
COPY client/tsconfig.json ./client/
COPY client/tsconfig.app.json ./client/
COPY client/tsconfig.node.json ./client/
COPY client/eslint.config.js ./client/


# Copying public directory and source code
COPY client/public/ ./client/public/
COPY client/src/ ./client/src/


# Stage: Client dev
FROM client-base AS client-dev

WORKDIR /app/client
# Expose vite port:
EXPOSE 5173

# Command to init dev mode
CMD ["npm", "run", "dev"]

# Stage: client-build
FROM client-base AS client-build
RUN npm run build

######### BACKEND STAGE ############
# Stage: base-client
FROM gradle:jdk21-alpine AS builder

# Workdir for gradle
WORKDIR /home/gradle/project

# Copying definitions
COPY backend/build.gradle backend/settings.gradle backend/gradlew ./
COPY backend/gradle ./gradle/

# Copying .env file
COPY backend/.env.dev ./

RUN chmod +x ./gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code and convert it to JAR
COPY backend/src ./src
RUN ./gradlew bootJar --no-daemon -x test

# Stage: runtime
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Creating a non-root user
RUN addgroup -S springgroup && adduser -S springuser -G springgroup

# Copying JAR exec with new user property
COPY --chown=springuser:springgroup --from=builder /home/gradle/project/build/libs/*.jar app.jar

# Switching user
USER springuser

# Endpoint exposed
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]


