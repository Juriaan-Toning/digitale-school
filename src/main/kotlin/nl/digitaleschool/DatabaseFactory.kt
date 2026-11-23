package nl.digitaleschool

import java.sql.Connection
import java.sql.DriverManager
import java.util.Properties

object DatabaseFactory {
    private val url: String? get() = System.getenv("DB_URL")
    private val user: String? get() = System.getenv("DB_USER")
    private val password: String? get() = System.getenv("DB_PASSWORD")

    private fun checkCredentials() {
        if (url == null || user == null || password == null) {
            throw IllegalStateException(
                "Database omgevingsvariabelen (DB_URL, DB_USER, DB_PASSWORD) ontbreken. " +
                "Controleer of ze zijn ingesteld in het Render Dashboard onder 'Environment Variables' (niet 'Secret Files')."
            )
        }
    }

    fun getConnection(): Connection {
        checkCredentials()
        val props = Properties()
        props.setProperty("user", user!!)
        props.setProperty("password", password!!)
        props.setProperty("ssl", "true")
        props.setProperty("sslmode", "require")
        
        return DriverManager.getConnection(url!!, props)
    }

    fun fetchLeerlingen(): List<Leerling> {
        val leerlingen = mutableListOf<Leerling>()
        getConnection().use { connection ->
            val query = """
                SELECT l.id, l.naam, c.naam as coach_naam, l.eval_gesprek_1, l.eval_gesprek_2, l.eval_gesprek_3, l.eval_gesprek_4, l.eindgesprek, l.startgesprek
                FROM leerlingen l 
                LEFT JOIN coaches c ON l.coach = c.id
            """.trimIndent()
            
            val statement = connection.createStatement()
            val resultSet = statement.executeQuery(query)
            
            while (resultSet.next()) {
                leerlingen.add(
                    Leerling(
                        id = resultSet.getInt("id"),
                        naam = resultSet.getString("naam"),
                        coachNaam = resultSet.getString("coach_naam"),
                        evaluatieGesprek1 = resultSet.getDate("eval_gesprek_1")?.toLocalDate(),
                        evaluatieGesprek2 = resultSet.getDate("eval_gesprek_2")?.toLocalDate(),
                        evaluatieGesprek3 = resultSet.getDate("eval_gesprek_3")?.toLocalDate(),
                        evaluatieGesprek4 = resultSet.getDate("eval_gesprek_4")?.toLocalDate(),
                        eindGesprek = resultSet.getDate("eindgesprek")?.toLocalDate(),
                        startGesprek = resultSet.getDate("startgesprek")?.toLocalDate()
                    )
                )
            }
        }
        return leerlingen
    }

    fun updateLeerling(leerling: Leerling) {
        getConnection().use { connection ->
            val query = """
                UPDATE leerlingen 
                SET eval_gesprek_1 = ?, eval_gesprek_2 = ?, eval_gesprek_3 = ?, eval_gesprek_4 = ?, eindgesprek = ?, startgesprek = ?
                WHERE id = ?
            """.trimIndent()
            
            val statement = connection.prepareStatement(query)
            statement.setDate(1, leerling.evaluatieGesprek1?.let { java.sql.Date.valueOf(it) })
            statement.setDate(2, leerling.evaluatieGesprek2?.let { java.sql.Date.valueOf(it) })
            statement.setDate(3, leerling.evaluatieGesprek3?.let { java.sql.Date.valueOf(it) })
            statement.setDate(4, leerling.evaluatieGesprek4?.let { java.sql.Date.valueOf(it) })
            statement.setDate(5, leerling.eindGesprek?.let { java.sql.Date.valueOf(it) })
            statement.setDate(6, leerling.startGesprek?.let { java.sql.Date.valueOf(it) })
            statement.setInt(7, leerling.id)
            
            statement.executeUpdate()
        }
    }
}
