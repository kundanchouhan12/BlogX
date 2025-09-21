# Stage 1: Build with Gradle
FROM gradle:8.10.2-jdk17 AS build
WORKDIR /app

# Copy Gradle files
COPY build.gradle .
COPY settings.gradle .
# Agar tu Gradle Kotlin DSL use karta hai to ye bhi:
# COPY build.gradle.kts .
# COPY settings.gradle.kts .

# Copy source code
COPY src ./src

# Build jar
RUN gradle clean build -x test

# Stage 2: Run with Microsoft OpenJDK
FROM mcr.microsoft.com/openjdk/jdk:17-ubuntu
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

