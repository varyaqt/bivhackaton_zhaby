package ru.slivoviy.frog.insurance

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
    fromApplication<FrogInsuranceApplication>().with(TestcontainersConfiguration::class).run(*args)
}
