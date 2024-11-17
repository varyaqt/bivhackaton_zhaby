package ru.slivoviy.frog.insurance.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import org.hibernate.cfg.AvailableSettings
import org.hibernate.type.format.jackson.JacksonJsonFormatMapper
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.sql.DataSource

const val DATASOURCE_BEAN_NAME = "dataSource"
const val ENTITY_MANAGER_FACTORY_BEAN_NAME = "entityManagerFactory"
const val TRANSACTION_MANAGER_BEAN_NAME = "transactionManager"

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = ["ru.slivoviy.frog.insurance.logic.repository"],
    entityManagerFactoryRef = ENTITY_MANAGER_FACTORY_BEAN_NAME,
    transactionManagerRef = TRANSACTION_MANAGER_BEAN_NAME,
)
class DatabaseConfiguration {
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.main")
    fun dataSourceProperties(): DataSourceProperties = DataSourceProperties()

    @Bean
    @Primary
    @Qualifier(DATASOURCE_BEAN_NAME)
    fun dataSource(): DataSource = dataSourceProperties().initializeDataSourceBuilder().build()

    @Bean
    @Primary
    @Qualifier(ENTITY_MANAGER_FACTORY_BEAN_NAME)
    fun entityManagerFactory(
        @Qualifier(DATASOURCE_BEAN_NAME) dataSource: DataSource,
        builder: EntityManagerFactoryBuilder,
        objectMapper: ObjectMapper,
    ): LocalContainerEntityManagerFactoryBean {
        return builder
            .dataSource(dataSource)
            .packages("ru.slivoviy.frog.insurance.logic.entity")
            .properties(mapOf(AvailableSettings.JSON_FORMAT_MAPPER to JacksonJsonFormatMapper(objectMapper)))
            .build()
    }

    @Bean
    @Primary
    fun transactionManager(
        @Qualifier(ENTITY_MANAGER_FACTORY_BEAN_NAME)
        mainEntityManagerFactory: LocalContainerEntityManagerFactoryBean
    ): PlatformTransactionManager {
        return JpaTransactionManager(mainEntityManagerFactory.getObject()!!)
    }
}