package nl.digitaleschool

import java.sql.Connection
import java.sql.DriverManager

object DatabaseFactory {
    private val url = System.getenv("DB_URL")
    private val user = System.getenv("DB_USER")
    private val password = System.getenv("DB_PASSWORD")

    init {
        if (url == null || user == null || password == null) {
            throw IllegalStateException("Database omgevingsvariabelen (DB_URL, DB_USER, DB_PASSWORD) ontbreken.")
        }
    }

    fun getConnection(): Connection = DriverManager.getConnection(url!!, user!!, password!!)

    fun fetchLeerlingen(): List<Leerling> {
        val leerlingen = mutableListOf<Leerling>()
        getConnection().use { connection ->
            val query = """
                SELECT l.id, l.naam, c.naam as coach_naam 
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
                        coachNaam = resultSet.getString("coach_naam")
                    )
                )
            }
        }
        return leerlingen
    }
}
