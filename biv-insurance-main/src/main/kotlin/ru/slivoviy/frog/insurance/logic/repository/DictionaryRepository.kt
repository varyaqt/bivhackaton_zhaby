package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.Dictionary
import java.util.UUID

interface DictionaryRepository : JpaRepository<Dictionary, UUID> {
}