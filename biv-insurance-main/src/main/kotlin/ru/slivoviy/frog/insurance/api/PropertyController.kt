package ru.slivoviy.frog.insurance.api

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.slivoviy.frog.insurance.logic.entity.Property
import ru.slivoviy.frog.insurance.logic.entity.PropertyType
import ru.slivoviy.frog.insurance.logic.entity.Rule
import ru.slivoviy.frog.insurance.logic.repository.InsuranceRepository
import ru.slivoviy.frog.insurance.logic.repository.PropertyRepository
import ru.slivoviy.frog.insurance.logic.repository.PropertyTypeRepository
import ru.slivoviy.frog.insurance.logic.repository.RuleRepository
import ru.slivoviy.frog.insurance.model.PropertyDto
import ru.slivoviy.frog.insurance.model.PropertyTypeDto
import java.util.UUID
import kotlin.jvm.optionals.getOrElse

@RestController
class PropertyController(
    private val propertyTypeRepository: PropertyTypeRepository,
    private val propertyRepository: PropertyRepository,
    private val insuranceRepository: InsuranceRepository,
    private val ruleRepository: RuleRepository,
    private val objectMapper: ObjectMapper,
) : PropertyApi {
    override fun createProperty(insuranceId: UUID, propertyDto: PropertyDto?): ResponseEntity<UUID> {
        val insurance = insuranceRepository
            .findById(insuranceId)
            .getOrElse {
                throw NotFoundException(msg = "insurance with id [$insuranceId] not found")
            }

        val property = propertyRepository.save(
            Property(
                type = PropertyType(
                    id = propertyDto?.type?.id!!,
                    name = propertyDto.type.name!!,
                    description = propertyDto.type.description,
                    type = propertyDto.type.type!!,
                ),
                value = objectMapper.writeValueAsString(propertyDto.value),
                insurance = insurance
            )
        )

        propertyDto.rules?.let {
            it.forEach { ruleDto ->
                val rule = ruleRepository.save(
                    Rule(
                        type = ruleDto.type!!,
                        value = objectMapper.writeValueAsString(ruleDto.value),
                        property = property,
                    )
                )

                propertyRepository.saveAll(
                    ruleDto.properties?.map { prop ->
                        Property(
                            type = PropertyType(
                                id = prop.type?.id!!,
                                name = prop.type.name!!,
                                description = prop.type.description,
                                type = prop.type.type!!,
                            ),
                            rule = rule,
                            value = objectMapper.writeValueAsString(prop.value),
                            insurance = insurance
                        )
                    }!!
                )
            }
        }

        return ResponseEntity.ok(property.id)
    }

    override fun createPropertyType(propertyTypeDto: PropertyTypeDto?): ResponseEntity<UUID> {
        val propertyType = propertyTypeRepository.save(
            PropertyType(
                name = propertyTypeDto?.name!!,
                description = propertyTypeDto.description,
                type = propertyTypeDto.type!!,
            )
        )

        return ResponseEntity.ok(propertyType.id)
    }
}