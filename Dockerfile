
# ==========================================
# Stage 1: Build Angular frontend
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

# Installeer dependencies (inclusief devDependencies voor de CLI)
RUN npm ci --no-audit --no-fund

COPY frontend/ ./

# Gebruik npx om de lokale angular-cli aan te roepen, voorkomt permissie problemen
RUN npx ng build



# ==========================================
# Stage 2: Build Spring Boot backend
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Copy Angular build into Spring Boot static resources
# Opmerking: dist pad kan variëren per Angular versie, controleer of /browser nodig is
COPY --from=frontend-build /app/frontend/dist/digitale-school-frontend/browser/ ./src/main/resources/static/

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
