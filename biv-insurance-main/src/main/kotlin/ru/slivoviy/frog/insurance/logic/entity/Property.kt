package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Table(name = "fi_property")
@Entity
data class Property(

    @Id
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    var type: PropertyType,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "value", nullable = false)
    var value: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "property")
    var rules: MutableSet<Rule>? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = true)
    var rule: Rule? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id", nullable = true)
    var insurance: Insurance? = null,


    )