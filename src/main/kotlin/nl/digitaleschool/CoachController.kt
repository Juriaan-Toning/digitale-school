package nl.digitaleschool

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.slf4j.LoggerFactory

@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = ["*"])
class CoachController {
    
    private val logger = LoggerFactory.getLogger(CoachController::class.java)

    @GetMapping
    fun getCoaches(): List<Coach> {
        return try {
            DatabaseFactory.fetchCoaches()
        } catch (e: Exception) {
            logger.error("Fout bij het ophalen van coaches", e)
            throw e
        }
    }
}
