package ru.slivoviy.frog.insurance.api

import com.fasterxml.jackson.databind.ObjectMapper
import mu.KotlinLogging
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.slivoviy.frog.insurance.logic.entity.Insurance
import ru.slivoviy.frog.insurance.logic.repository.InsuranceRepository
import ru.slivoviy.frog.insurance.model.InsuranceProductDto
import ru.slivoviy.frog.insurance.model.PropertyDto
import ru.slivoviy.frog.insurance.model.PropertyTypeDto
import ru.slivoviy.frog.insurance.model.RuleDto
import ru.slivoviy.frog.insurance.model.ValueDto
import java.time.OffsetDateTime
import java.util.UUID
import kotlin.jvm.optionals.getOrElse

private val logger = KotlinLogging.logger { }

@RestController
class InsuranceController(
    private val insuranceRepository: InsuranceRepository,
    private val objectMapper: ObjectMapper,
) : InsuranceApi {

    override fun createInsurance(name: String?): ResponseEntity<UUID> {
        val insurance = insuranceRepository.save(
            Insurance(
                name = name!!,
                createdAt = OffsetDateTime.now(),
            )
        )

        return ResponseEntity.ok(insurance.id)
    }

    override fun deleteInsurance(id: UUID): ResponseEntity<Unit> {
        insuranceRepository.deleteById(id)

        return ResponseEntity.ok(Unit)
    }

    override fun getInsurance(id: UUID): ResponseEntity<InsuranceProductDto> {
        val insurance = insuranceRepository
            .findById(id)
            .getOrElse {
                throw NotFoundException(msg = "insurance with id [$id] not found")
            }

        return ResponseEntity.ok(
            InsuranceProductDto(
                id = insurance.id,
                createdAt = insurance.createdAt,
                name = insurance.name,
                properties = insurance.properties?.map { property ->
                    PropertyDto(
                        id = property.id,
                        type = PropertyTypeDto(
                            id = property.type.id,
                            name = property.type.name,
                            description = property.type.description,
                            type = property.type.type
                        ),
                        value = objectMapper.readValue(property.value, ValueDto::class.java),
                        rules = property.rules?.map { rule ->
                            RuleDto(
                                id = rule.id,
                                type = rule.type,
                                value = rule.value,
                                properties = rule.properties.map { ruleProperty ->
                                    PropertyDto(
                                        id = ruleProperty.id,
                                        type = PropertyTypeDto(
                                            id = ruleProperty.type.id,
                                            name = ruleProperty.type.name,
                                            description = ruleProperty.type.description,
                                            type = ruleProperty.type.type,
                                        ),
                                        value = objectMapper.readValue(ruleProperty.value, ValueDto::class.java),
                                    )
                                },
                                targetedProperty = PropertyDto(
                                    id = rule.property.id,
                                    type = PropertyTypeDto(
                                        id = rule.property.type.id,
                                        name = rule.property.type.name,
                                        description = rule.property.type.description,
                                        type = rule.property.type.type,
                                    ),
                                    value = objectMapper.readValue(rule.property.value, ValueDto::class.java),
                                )
                            )
                        }
                    )
                }
            )
        )
    }

    override fun updateInsurance(id: UUID, insuranceProductDto: InsuranceProductDto?): ResponseEntity<Unit> {
        return super.updateInsurance(id, insuranceProductDto)
    }
}