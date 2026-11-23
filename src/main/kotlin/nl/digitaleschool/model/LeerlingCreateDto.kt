package nl.digitaleschool.model

import java.time.LocalDate

data class LeerlingCreateDto(
    val naam: String,
    val coachId: Int?,
    val evaluatieGesprek1: LocalDate?,
    val evaluatieGesprek2: LocalDate?,
    val evaluatieGesprek3: LocalDate?,
    val evaluatieGesprek4: LocalDate?,
    val eindGesprek: LocalDate?,
    val startGesprek: LocalDate?
)