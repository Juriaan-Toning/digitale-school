package nl.digitaleschool

import java.time.LocalDate

data class Leerling(
    val id: Int,
    val naam: String,
    val coachNaam: String?,
    val evaluatieGesprek1: LocalDate?,
    val evaluatieGesprek2: LocalDate?,
    val evaluatieGesprek3: LocalDate?,
    val evaluatieGesprek4: LocalDate?,
    val eindGesprek: LocalDate?,
    val startGesprek: LocalDate?
    )
