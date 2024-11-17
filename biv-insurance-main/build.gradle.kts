import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.3.5"
    id("io.spring.dependency-management") version "1.1.6"
    kotlin("plugin.jpa") version "1.9.25"
    id("org.openapi.generator") version "7.8.0"
}

group = "ru.slivoviy"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc:3.3.1")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.3.2")
    implementation("org.springframework.boot:spring-boot-starter-jdbc:3.3.2")
    implementation("org.springframework.boot:spring-boot-starter-web:3.3.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect:2.0.0")
    implementation("io.swagger.core.v3:swagger-annotations:2.2.25")
    implementation("io.swagger.core.v3:swagger-models:2.2.25")
    implementation("javax.validation:validation-api:2.0.1.Final")
    compileOnly("javax.servlet:javax.servlet-api:4.0.1")
    runtimeOnly("org.postgresql:postgresql:42.7.3")
    implementation ("io.github.microutils:kotlin-logging-jvm:3.0.5")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.3.1")
    testImplementation("org.springframework.boot:spring-boot-testcontainers:3.3.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.testcontainers:junit-jupiter:1.20.0")
    testImplementation("org.testcontainers:postgresql:1.20.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.10.3")
}

openApiGenerate {
    generatorName.set("kotlin-spring")
    inputSpec.set("src/main/resources/api.yaml")
    apiPackage.set("ru.slivoviy.frog.insurance.api")
    modelPackage.set("ru.slivoviy.frog.insurance.model")
    typeMappings.set(
        mapOf(
            "dateLibrary" to "java8"
        )
    )
    configOptions.set(mapOf("interfaceOnly" to "true"))
}

sourceSets {
    main {
        java {
            srcDir("$buildDir/generate-resources/main/src/main/kotlin")
        }
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile>().configureEach {
    dependsOn("openApiGenerate")
}
