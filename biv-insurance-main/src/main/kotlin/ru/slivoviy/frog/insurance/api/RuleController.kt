package ru.slivoviy.frog.insurance.api

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.slivoviy.frog.insurance.logic.entity.Property
import ru.slivoviy.frog.insurance.logic.entity.PropertyType
import ru.slivoviy.frog.insurance.logic.repository.InsuranceRepository
import ru.slivoviy.frog.insurance.logic.repository.PropertyRepository
import ru.slivoviy.frog.insurance.logic.repository.RuleRepository
import ru.slivoviy.frog.insurance.model.PropertyDto
import java.util.UUID
import kotlin.jvm.optionals.getOrElse

@RestController
class RuleController(
    private val insuranceRepository: InsuranceRepository,
    private val ruleRepository: RuleRepository,
    private val propertyRepository: PropertyRepository,
    private val objectMapper: ObjectMapper,
) : RuleApi {

    override fun addRuleProperty(insuranceId: UUID, id: UUID, propertyDto: List<PropertyDto>?): ResponseEntity<Unit> {
        val insurance = insuranceRepository
            .findById(insuranceId)
            .getOrElse {
                throw NotFoundException(msg = "insurance with id [$insuranceId] not found")
            }

        val rule = ruleRepository
            .findById(insuranceId)
            .getOrElse {
                throw NotFoundException(msg = "rule with id [$id] not found")
            }

        propertyRepository.saveAll(
            propertyDto!!.map {
                Property(
                    type = PropertyType(
                        id = it.type?.id!!,
                        name = it.type.name!!,
                        description = it.type.description,
                        type = it.type.type!!,
                    ),
                    value = objectMapper.writeValueAsString(it.value),
                    rule = rule,
                    insurance = insurance
                )
            }
        )

        return ResponseEntity.ok(Unit)
    }
}