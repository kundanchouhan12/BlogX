# Stage 1: Build with Gradle
FROM gradle:8.10.2-jdk17 AS build
WORKDIR /app

# Copy Gradle files
COPY build.gradle .
COPY settings.gradle .

# Copy source
COPY src ./src

# Build JAR (skip tests for faster build)
RUN gradle clean build -x test

# Stage 2: Run with lightweight JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
