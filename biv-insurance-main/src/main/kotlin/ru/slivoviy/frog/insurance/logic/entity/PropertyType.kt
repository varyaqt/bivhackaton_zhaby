package ru.slivoviy.frog.insurance.logic.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.proxy.HibernateProxy
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
) {
  final override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (other == null) return false
    val oEffectiveClass =
      if (other is HibernateProxy) other.hibernateLazyInitializer.persistentClass else other.javaClass
    val thisEffectiveClass =
      if (this is HibernateProxy) this.hibernateLazyInitializer.persistentClass else this.javaClass
    if (thisEffectiveClass != oEffectiveClass) return false
    other as PropertyType

    return id != null && id == other.id
  }

  final override fun hashCode(): Int =
    if (this is HibernateProxy) this.hibernateLazyInitializer.persistentClass.hashCode() else javaClass.hashCode()

  @Override
  override fun toString(): String {
    return this::class.simpleName + "(id = $id , name = $name , description = $description , type = $type )"
  }
}
