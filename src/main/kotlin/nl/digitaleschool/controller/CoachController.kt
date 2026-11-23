package nl.digitaleschool.controller

import nl.digitaleschool.DatabaseFactory
import nl.digitaleschool.model.Coach
import nl.digitaleschool.model.CoachCreateDto
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

    @PostMapping
    fun addCoach(@RequestBody coachDto: CoachCreateDto) {
        try {
            DatabaseFactory.addCoach(coachDto.naam)
        } catch (e: Exception) {
            logger.error("Fout bij het toevoegen van coach", e)
            throw e
        }
    }
}
