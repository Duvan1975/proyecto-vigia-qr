# Imagen base con Maven y Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copiamos todo el proyecto
COPY . .

# Compilamos el proyecto
RUN mvn clean package -DskipTests

# Imagen liviana solo con Java 17
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiamos el jar desde la etapa build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
