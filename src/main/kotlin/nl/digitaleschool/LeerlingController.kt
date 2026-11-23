package nl.digitaleschool

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.slf4j.LoggerFactory

@RestController
@RequestMapping("/api/leerlingen")
@CrossOrigin(origins = ["*"])
class LeerlingController {
    
    private val logger = LoggerFactory.getLogger(LeerlingController::class.java)

    @GetMapping
    fun getLeerlingen(): List<Leerling> {
        return try {
            DatabaseFactory.fetchLeerlingen()
        } catch (e: Exception) {
            logger.error("Fout bij het ophalen van leerlingen", e)
            throw e
        }
    }

    @PutMapping("/{id}")
    fun updateLeerling(@PathVariable id: Int, @RequestBody leerling: Leerling) {
        try {
            DatabaseFactory.updateLeerling(leerling)
        } catch (e: Exception) {
            logger.error("Fout bij het bijwerken van leerling met id $id", e)
            throw e
        }
    }

    @PostMapping
    fun addLeerling(@RequestBody leerling: Leerling) {
        try {
            DatabaseFactory.addLeerling(leerling)
        } catch (e: Exception) {
            logger.error("Fout bij het toevoegen van leerling", e)
            throw e
        }
    }
}
