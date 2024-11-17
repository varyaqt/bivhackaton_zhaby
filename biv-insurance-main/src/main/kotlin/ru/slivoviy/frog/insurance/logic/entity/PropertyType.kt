package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.util.UUID

@Table(name = "fi_property_type")
@Entity
data class PropertyType(

    @Id
    var id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "description", nullable = true)
    var description: String?,

    @Column(name = "type", nullable = false)
    var type: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "type")
    var properties: MutableSet<Property>? = null
)
