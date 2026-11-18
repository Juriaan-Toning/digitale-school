package nl.digitaleschool

import java.sql.Connection
import java.sql.DriverManager

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
        val props = java.util.Properties()
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
