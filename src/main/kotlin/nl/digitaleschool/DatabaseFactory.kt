package nl.digitaleschool

import nl.digitaleschool.model.Coach
import nl.digitaleschool.model.Leerling
import nl.digitaleschool.model.LeerlingCreateDto
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
                SELECT l.id, l.naam, l.coach as coach_id, c.naam as coach_naam, l.eval_gesprek_1, l.eval_gesprek_2, l.eval_gesprek_3, l.eval_gesprek_4, l.eindgesprek, l.startgesprek
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
                        coachId = resultSet.getInt("coach_id").let { if (resultSet.wasNull()) null else it },
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
                SET eval_gesprek_1 = ?, eval_gesprek_2 = ?, eval_gesprek_3 = ?, eval_gesprek_4 = ?, eindgesprek = ?, startgesprek = ?, coach = ?
                WHERE id = ?
            """.trimIndent()
            
            val statement = connection.prepareStatement(query)
            statement.setDate(1, leerling.evaluatieGesprek1?.let { java.sql.Date.valueOf(it) })
            statement.setDate(2, leerling.evaluatieGesprek2?.let { java.sql.Date.valueOf(it) })
            statement.setDate(3, leerling.evaluatieGesprek3?.let { java.sql.Date.valueOf(it) })
            statement.setDate(4, leerling.evaluatieGesprek4?.let { java.sql.Date.valueOf(it) })
            statement.setDate(5, leerling.eindGesprek?.let { java.sql.Date.valueOf(it) })
            statement.setDate(6, leerling.startGesprek?.let { java.sql.Date.valueOf(it) })
            if (leerling.coachId != null) {
                statement.setInt(7, leerling.coachId)
            } else {
                statement.setNull(7, java.sql.Types.INTEGER)
            }
            statement.setInt(8, leerling.id)
            
            statement.executeUpdate()
        }
    }

    fun addLeerling(leerling: LeerlingCreateDto) {
        getConnection().use { connection ->
            val query = """
                INSERT INTO leerlingen (naam, coach, eval_gesprek_1, eval_gesprek_2, eval_gesprek_3, eval_gesprek_4, eindgesprek, startgesprek)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()
            val statement = connection.prepareStatement(query)
            statement.setString(1, leerling.naam)
            if (leerling.coachId != null) {
                statement.setInt(2, leerling.coachId)
            } else {
                statement.setNull(2, java.sql.Types.INTEGER)
            }
            statement.setDate(3, leerling.evaluatieGesprek1?.let { java.sql.Date.valueOf(it) })
            statement.setDate(4, leerling.evaluatieGesprek2?.let { java.sql.Date.valueOf(it) })
            statement.setDate(5, leerling.evaluatieGesprek3?.let { java.sql.Date.valueOf(it) })
            statement.setDate(6, leerling.evaluatieGesprek4?.let { java.sql.Date.valueOf(it) })
            statement.setDate(7, leerling.eindGesprek?.let { java.sql.Date.valueOf(it) })
            statement.setDate(8, leerling.startGesprek?.let { java.sql.Date.valueOf(it) })
            statement.executeUpdate()
        }
    }

    fun addCoach(naam: String) {
        getConnection().use { connection ->
            val query = "INSERT INTO coaches (naam) VALUES (?)"
            val statement = connection.prepareStatement(query)
            statement.setString(1, naam)
            statement.executeUpdate()
        }
    }

    fun fetchCoaches(): List<Coach> {
        val coaches = mutableListOf<Coach>()
        getConnection().use { connection ->
            val query = "SELECT id, naam FROM coaches ORDER BY naam"
            val statement = connection.createStatement()
            val resultSet = statement.executeQuery(query)
            while (resultSet.next()) {
                coaches.add(
                    Coach(
                        id = resultSet.getInt("id"),
                        naam = resultSet.getString("naam")
                    )
                )
            }
        }
        return coaches
    }
}
