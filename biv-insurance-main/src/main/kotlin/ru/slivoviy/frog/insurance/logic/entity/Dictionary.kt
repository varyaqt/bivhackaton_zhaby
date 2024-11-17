package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.util.UUID

@Table(name = "fi_dictionary")
@Entity
data class Dictionary(

    @Id
    var id: UUID = UUID.randomUUID(),

    @Column(name = "name")
    var name: String? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "dictionary")
    var values: MutableList<DictionaryValue>? = null,
)