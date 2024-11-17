package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID


@Table(name = "fi_dictionary_value")
@Entity
data class DictionaryValue(

    @Id
    var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dictionary_id", nullable = false)
    var dictionary: Dictionary,

    var value: String,
)