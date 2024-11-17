package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.Property
import java.util.UUID

interface PropertyRepository : JpaRepository<Property, UUID> {
}