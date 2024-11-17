package ru.slivoviy.frog.insurance.api

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import ru.slivoviy.frog.insurance.logic.entity.Dictionary
import ru.slivoviy.frog.insurance.logic.entity.DictionaryValue
import ru.slivoviy.frog.insurance.logic.repository.DictionaryRepository
import ru.slivoviy.frog.insurance.logic.repository.DictionaryValueRepository
import ru.slivoviy.frog.insurance.model.DictionaryDto
import ru.slivoviy.frog.insurance.model.DictionaryValueDto
import java.util.UUID
import kotlin.jvm.optionals.getOrElse

@RestController
class DictionaryController(
    private val dictionaryRepository: DictionaryRepository,
    private val valueRepository: DictionaryValueRepository,
) : DictionaryApi {
    override fun addDictionaryValue(id: UUID, requestBody: List<String>?): ResponseEntity<List<UUID>> {
        val dictionary = dictionaryRepository
            .findById(id)
            .getOrElse {
                throw NotFoundException(msg = "dictionary with id [$id] not found")
            }

        val values = valueRepository.saveAll(
            requestBody?.map { DictionaryValue(dictionary = dictionary, value = it) }!!
        )

        return ResponseEntity.ok(values.map { it.id })
    }

    override fun createDictionary(dictionaryDto: DictionaryDto?): ResponseEntity<UUID> {
        val dictionary = dictionaryRepository.save(
            Dictionary(
                name = dictionaryDto!!.name
            )
        )

        valueRepository.saveAll(
            dictionaryDto.dictValues?.map { DictionaryValue(dictionary = dictionary, value = it.value!!) }!!
        )

        return ResponseEntity.ok(dictionary.id)
    }

    override fun getDictionary(id: UUID): ResponseEntity<DictionaryDto> {
        val dictionary = dictionaryRepository
            .findById(id)
            .getOrElse {
                throw NotFoundException(msg = "dictionary with id [$id] not found")
            }

        return ResponseEntity.ok(
            DictionaryDto(
                id = dictionary?.id,
                name = dictionary?.name,
                dictValues = dictionary?.values?.map { DictionaryValueDto(it.id, it.value) }
            )
        )
    }

    override fun getDictionaryValue(dictionaryId: UUID, valueId: UUID): ResponseEntity<String> {
        val dictionaryValue = valueRepository
            .findById(valueId)
            .getOrElse {
                throw NotFoundException(msg = "dictionary value with id [$valueId] not found")
            }

        return ResponseEntity.ok(dictionaryValue.value)
    }
}