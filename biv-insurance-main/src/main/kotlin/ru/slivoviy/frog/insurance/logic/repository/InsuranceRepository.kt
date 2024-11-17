package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.Insurance
import java.util.UUID

interface InsuranceRepository : JpaRepository<Insurance, UUID> {
}