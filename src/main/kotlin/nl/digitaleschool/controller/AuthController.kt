package nl.digitaleschool.controller

import nl.digitaleschool.model.LoginRequest
import nl.digitaleschool.model.LoginResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController {

    private val expectedUsername: String get() = System.getenv("USERNAME")
    private val expectedPassword: String get() = System.getenv("PASSWORD")

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        return if (request.username == expectedUsername && request.password == expectedPassword) {
            ResponseEntity.ok(LoginResponse(true, "Login succesvol"))
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(LoginResponse(false, "Ongeldige gebruikersnaam of wachtwoord"))
        }
    }
}
