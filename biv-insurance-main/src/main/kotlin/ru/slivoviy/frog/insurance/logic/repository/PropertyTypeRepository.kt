package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.PropertyType
import java.util.UUID

interface PropertyTypeRepository : JpaRepository<PropertyType, UUID> {
}