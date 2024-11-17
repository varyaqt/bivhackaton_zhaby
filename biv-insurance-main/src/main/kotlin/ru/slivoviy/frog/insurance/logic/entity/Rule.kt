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


@Table(name = "fi_rule")
@Entity
data class Rule(

    @Id
    var id: UUID = UUID.randomUUID(),

    @Column(name = "type", nullable = false)
    var type: String,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "value", nullable = false)
    var value: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "rule")
    var properties: MutableSet<Property> = mutableSetOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    var property: Property,
)