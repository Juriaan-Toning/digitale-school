
# ==========================================
# Stage 1: Build Angular frontend
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

# Installeer dependencies (inclusief devDependencies voor de CLI)
RUN npm ci --no-audit --no-fund

COPY frontend/ ./

# Zorg dat de ng executable uitvoerbaar is en bouw de frontend
# We gebruiken een wildcard om de bestanden uit de dist map te kopiëren, ongeacht of er een /browser submap is
RUN chmod +x node_modules/.bin/ng && ./node_modules/.bin/ng build



# ==========================================
# Stage 2: Build Spring Boot backend
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Copy Angular build into Spring Boot static resources
# We kopiëren alles uit de dist map naar de static resources. 
# De wildcard zorgt ervoor dat we zowel de directie bestanden als submappen (zoals /browser) meenemen.
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
