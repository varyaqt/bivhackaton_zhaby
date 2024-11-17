package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

@Table(name = "fi_insurance")
@Entity
data class Insurance(

    @Id
    var id: UUID = UUID.randomUUID(),

    @Column(name = "name")
    var name: String,

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "insurance")
    var properties: MutableSet<Property>? = null,

    @JdbcTypeCode(SqlTypes.TIMESTAMP_WITH_TIMEZONE)
    @Column(name = "created_at", nullable = false)
    var createdAt: OffsetDateTime = OffsetDateTime.now()
)