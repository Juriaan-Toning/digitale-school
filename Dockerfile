
# ==========================================
# Stage 1: Build Angular frontend
# ==========================================
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

# Update npm
RUN npm install -g npm@12.2.2

COPY frontend/package.json frontend/package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force \
    && npm ci --no-audit --no-fund

COPY frontend/ ./

RUN npm run build



# ==========================================
# Stage 2: Build Spring Boot backend
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Copy Angular build into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist/digitale-school-frontend/ ./src/main/resources/static/

# Build Spring Boot application
RUN mvn clean package -DskipTests


# ==========================================
# Stage 3: Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
