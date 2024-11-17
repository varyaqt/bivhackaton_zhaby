package ru.slivoviy.frog.insurance.logic.repository;

import org.springframework.data.jpa.repository.JpaRepository
import ru.slivoviy.frog.insurance.logic.entity.Rule
import java.util.UUID

interface RuleRepository : JpaRepository<Rule, UUID> {


}