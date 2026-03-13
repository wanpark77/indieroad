FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle.kts .
COPY backend/settings.gradle.kts .
COPY backend/src src
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xms256m", "-Xmx384m", \
  "-Dspring.profiles.active=prod", \
  "-Dspring.datasource.url=jdbc:postgresql://postgres.railway.internal:5432/railway", \
  "-Dspring.datasource.username=postgres", \
  "-Dspring.datasource.password=TKsioxrYOiZskFMexTRvEfegLacxZtlB", \
  "-jar", "app.jar"]
