package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.DictionaryValue
import java.util.UUID

interface DictionaryValueRepository : JpaRepository<DictionaryValue, UUID> {

}